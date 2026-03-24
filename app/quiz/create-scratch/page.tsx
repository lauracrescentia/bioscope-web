"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type QuestionType = 'quiz' | 'multiple' | 'true-false';

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  media: string | null;
  options: string[];
  correctAnswers: number[];
  timeLimit: number;
}

// 1. Komponen Utama dipisah agar bisa dibungkus Suspense
function BlankCanvasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [gameName, setGameName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentView, setCurrentView] = useState<'editor' | 'selector'>('selector');
  const [isEditingExisting, setIsEditingExisting] = useState<number | null>(null);

  const [editingQ, setEditingQ] = useState<Question>({
    id: Date.now(),
    type: 'quiz',
    text: '',
    media: null,
    options: ['', '', '', ''],
    correctAnswers: [],
    timeLimit: 30
  });

  useEffect(() => {
    if (editId) {
      const library = JSON.parse(localStorage.getItem('game_library') || '[]');
      const targetGame = library.find((g: any) => g.id === parseInt(editId));
      
      if (targetGame) {
        setGameName(targetGame.name);
        setQuestions(targetGame.questions || []);
      }
    }
  }, [editId]);

  const changeType = (type: QuestionType) => {
    setEditingQ({
      ...editingQ,
      type: type,
      options: type === 'true-false' ? ['Benar', 'Salah'] : (editingQ.options.length === 2 ? ['', '', '', ''] : editingQ.options),
      correctAnswers: [] 
    });
  };

  const toggleAnswer = (index: number) => {
    let newAnswers = [...editingQ.correctAnswers];
    if (editingQ.type === 'multiple') {
      newAnswers = newAnswers.includes(index) ? newAnswers.filter(a => a !== index) : [...newAnswers, index];
    } else {
      newAnswers = [index];
    }
    setEditingQ({ ...editingQ, correctAnswers: newAnswers });
  };

  const saveQuestion = () => {
    if (!editingQ.text) return alert("Isi pertanyaan dulu!");
    if (editingQ.correctAnswers.length === 0) return alert("Pilih minimal satu jawaban benar!");
    
    if (isEditingExisting !== null) {
      const updatedQuestions = questions.map(q => q.id === isEditingExisting ? editingQ : q);
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, { ...editingQ, id: Date.now() }]);
    }
    resetEditor();
  };

  const resetEditor = () => {
    setCurrentView('selector');
    setIsEditingExisting(null);
    setEditingQ({ 
      id: Date.now(), 
      type: 'quiz', 
      text: '', 
      media: null, 
      options: ['', '', '', ''], 
      correctAnswers: [], 
      timeLimit: 30 
    });
  };

  const loadQuestionForEdit = (question: Question) => {
    setEditingQ(question);
    setIsEditingExisting(question.id);
    setCurrentView('editor');
  };

  const processFinalSave = () => {
    const finalName = gameName.trim() || "Kuis Tanpa Judul";
    const existingLibrary = JSON.parse(localStorage.getItem('game_library') || '[]');
    let updatedLibrary;

    if (editId) {
      updatedLibrary = existingLibrary.map((g: any) => 
        g.id === parseInt(editId) 
          ? { ...g, name: finalName, questions: questions } 
          : g
      );
    } else {
      const gameData = { 
        id: Date.now(),
        name: finalName, 
        questions: questions, 
        createdAt: new Date().toISOString() 
      };
      updatedLibrary = [...existingLibrary, gameData];
    }

    localStorage.setItem('game_library', JSON.stringify(updatedLibrary));
    return finalName;
  };

  const handleQuit = () => {
    if(confirm("Keluar tanpa menyimpan?")) router.push('/quiz'); 
  };

  const handleSaveFinal = () => {
    if (questions.length === 0) return alert("Tambahkan minimal 1 soal dulu!");
    const savedName = processFinalSave();
    alert(`Berhasil! "${savedName}" sudah siap! 🚀`);
    router.push('/quiz'); 
  };

  return (
    <main className="min-h-screen bg-[#F0F4F8] p-6 md:p-10 font-sans text-[#0F172A]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <input 
          type="text" 
          placeholder="Ketik Judul Kuis Seru..." 
          className="text-2xl font-black bg-white border-4 border-[#0F172A] px-6 py-4 rounded-2xl outline-none w-full shadow-[6px_6px_0_0_#0F172A] placeholder:text-slate-400 text-[#0F172A]"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
        
        <div className="flex gap-4 shrink-0">
          <button onClick={handleQuit} className="px-6 py-4 bg-white text-[#EF4444] rounded-2xl font-black border-4 border-[#EF4444] shadow-[4px_4px_0_0_#EF4444] active:shadow-none active:translate-y-1 transition-all uppercase italic">🚪 QUIT</button>
          <button onClick={handleSaveFinal} className="px-6 py-4 bg-[#22C55E] text-white rounded-2xl font-black border-4 border-[#0F172A] shadow-[4px_4px_0_0_#0F172A] active:shadow-none active:translate-y-1 transition-all uppercase italic">💾 {editId ? 'UPDATE' : 'SAVE'}</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border-4 border-[#0F172A] p-6 rounded-[2rem] shadow-[8px_8px_0_0_#0F172A] sticky top-10">
            <h3 className="font-black uppercase italic mb-4">Daftar Soal ({questions.length})</h3>
            <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {questions.map((q, i) => (
                <button 
                  key={q.id} 
                  onClick={() => loadQuestionForEdit(q)}
                  className={`w-full p-3 border-2 border-[#0F172A] rounded-xl font-bold text-sm flex gap-2 items-center transition-all ${isEditingExisting === q.id ? 'bg-yellow-200' : 'bg-slate-100'}`}
                >
                  <span className="bg-[#0F172A] text-white w-6 h-6 flex items-center justify-center rounded-lg text-xs shrink-0 font-black">{i + 1}</span>
                  <p className="truncate italic">"{q.text || 'Tanpa teks'}"</p>
                </button>
              ))}
            </div>
            <button onClick={resetEditor} className="w-full py-3 bg-[#FACC15] border-2 border-[#0F172A] font-black rounded-xl shadow-[4px_4px_0_0_#0F172A] hover:bg-yellow-300 transition-all">+ TAMBAH PERTANYAAN</button>
          </div>
        </div>

        <div className="lg:col-span-3">
          {currentView === 'selector' ? (
            <div className="bg-white p-12 rounded-[3rem] border-4 border-[#0F172A] shadow-[10px_10px_0_0_#0F172A] text-center">
              <h2 className="text-3xl font-black uppercase italic mb-10">Pilih Jenis Misi</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'quiz', label: 'SINGLE QUIZ', icon: '🎯', color: 'bg-[#C7F9CC]' },
                  { id: 'multiple', label: 'MULTI CHOICE', icon: '🚀', color: 'bg-[#A2D2FF]' },
                  { id: 'true-false', label: 'YES OR NO', icon: '💎', color: 'bg-[#FFCFD2]' }
                ].map((type) => (
                  <button key={type.id} onClick={() => { changeType(type.id as QuestionType); setCurrentView('editor'); }} className={`${type.color} p-8 border-4 border-[#0F172A] rounded-[2rem] shadow-[6px_6px_0_0_#0F172A] hover:-translate-y-2 transition-all`}>
                    <div className="text-5xl mb-4">{type.icon}</div>
                    <div className="font-black tracking-tighter">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-8 rounded-[3rem] border-4 border-[#0F172A] shadow-[10px_10px_0_0_#6366F1] space-y-6">
                <textarea placeholder="Apa pertanyaan hebatmu?" className="w-full text-2xl font-black p-8 bg-slate-50 border-4 border-[#0F172A] rounded-2xl outline-none italic" value={editingQ.text} onChange={(e) => setEditingQ({...editingQ, text: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editingQ.options.map((opt, idx) => (
                    <div key={idx} className={`flex items-center p-3 border-4 border-[#0F172A] rounded-2xl transition-all ${editingQ.correctAnswers.includes(idx) ? 'bg-[#22C55E]' : 'bg-white'}`}>
                      <button onClick={() => toggleAnswer(idx)} className={`w-10 h-10 border-2 border-[#0F172A] rounded-lg font-black ${editingQ.correctAnswers.includes(idx) ? 'bg-white text-[#22C55E]' : 'bg-slate-100'}`}>{editingQ.correctAnswers.includes(idx) ? '✓' : idx + 1}</button>
                      <input type="text" placeholder="Ketik jawaban..." className={`flex-1 bg-transparent px-4 font-bold outline-none ${editingQ.correctAnswers.includes(idx) ? 'text-white' : ''}`} value={opt} onChange={(e) => { const newOpts = [...editingQ.options]; newOpts[idx] = e.target.value; setEditingQ({...editingQ, options: newOpts}); }} disabled={editingQ.type === 'true-false'} />
                    </div>
                  ))}
                </div>
                <button onClick={saveQuestion} className="w-full py-5 bg-[#8B5CF6] text-white border-4 border-[#0F172A] rounded-2xl font-black text-2xl shadow-[6px_6px_0_0_#0F172A] hover:translate-x-1 hover:translate-y-1 transition-all uppercase italic">
                   {isEditingExisting ? 'Update Pertanyaan ✅' : 'Masukan ke Daftar 🚀'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// 2. Export default yang membungkus konten dengan Suspense
export default function BlankCanvas() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center font-black uppercase italic animate-pulse">
        Memuat Lab Kuis...
      </div>
    }>
      <BlankCanvasContent />
    </Suspense>
  );
}