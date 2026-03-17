"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type QuestionType = 'quiz' | 'multiple' | 'true-false';

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  media: string | null;
  options: string[];
  correctAnswers: number[];
  timeLimit: number; // dalam detik
}

export default function BlankCanvas() {
  const router = useRouter();
  const [gameName, setGameName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentView, setCurrentView] = useState<'editor' | 'selector'>('selector');
  
  // State untuk soal yang sedang diedit
  const [editingQ, setEditingQ] = useState<Question>({
    id: Date.now(),
    type: 'quiz',
    text: '',
    media: null,
    options: ['', '', '', ''],
    correctAnswers: [],
    timeLimit: 30
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi Tambah Simbol/Equation (Simulasi)
  const addTextFormat = (symbol: string) => {
    setEditingQ({ ...editingQ, text: editingQ.text + symbol });
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditingQ({ ...editingQ, media: url });
    }
  };

  const toggleAnswer = (index: number) => {
    let newAnswers = [...editingQ.correctAnswers];
    if (editingQ.type === 'multiple') {
      newAnswers = newAnswers.includes(index) 
        ? newAnswers.filter(a => a !== index) 
        : [...newAnswers, index];
    } else {
      newAnswers = [index];
    }
    setEditingQ({ ...editingQ, correctAnswers: newAnswers });
  };

  const saveQuestion = () => {
    if (!editingQ.text) return alert("Isi pertanyaan dulu!");
    setQuestions([...questions, editingQ]);
    setCurrentView('selector');
    // Reset form untuk soal berikutnya
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

  const finalizeGame = () => {
    if (!gameName) return alert("Masukkan nama game!");
    const gameData = { name: gameName, questions, createdAt: new Date() };
    const library = JSON.parse(localStorage.getItem('game_library') || '[]');
    localStorage.setItem('game_library', JSON.stringify([...library, gameData]));
    alert("Game berhasil disimpan ke Library!");
    router.push('/games');
  };

  return (
    <main className="min-h-screen bg-slate-100 text-black p-4 md:p-8 font-sans">
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <input 
          type="text" 
          placeholder="Enter BIOScope Game Name..." 
          className="text-2xl font-black bg-transparent border-b-4 border-green-500 outline-none w-full md:w-auto pb-1"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
        <div className="flex gap-3">
          <button onClick={() => router.push('/games')} className="px-6 py-2 font-bold text-slate-500">Cancel</button>
          <button onClick={finalizeGame} className="px-8 py-3 bg-green-600 text-white rounded-2xl font-black shadow-lg hover:bg-green-700 transition">SAVE TO LIBRARY</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: List Pertanyaan */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold mb-4 flex justify-between">Questions <span>{questions.length}</span></h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {questions.map((q, i) => (
                <div key={q.id} className="p-3 bg-slate-50 rounded-xl text-xs font-medium border border-slate-100">
                  {i + 1}. {q.text.substring(0, 20)}...
                </div>
              ))}
            </div>
            <button 
              onClick={() => setCurrentView('selector')}
              className="w-full mt-4 py-3 border-2 border-dashed border-green-500 text-green-600 rounded-xl font-bold hover:bg-green-50 transition"
            >
              + Add Question
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3">
          {currentView === 'selector' ? (
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-200 text-center">
              <h2 className="text-2xl font-black mb-8">Pilih Tipe Pertanyaan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { id: 'quiz', label: 'Quiz', icon: '❓', desc: 'Satu jawaban benar' },
                  { id: 'multiple', label: 'Multiple Choice', icon: '✅', desc: 'Banyak jawaban benar' },
                  { id: 'true-false', label: 'True or False', icon: '⚖️', desc: 'Benar atau Salah' }
                ].map((type) => (
                  <button 
                    key={type.id}
                    onClick={() => {
                      setEditingQ({...editingQ, type: type.id as QuestionType, options: type.id === 'true-false' ? ['True', 'False'] : ['', '', '', '']});
                      setCurrentView('editor');
                    }}
                    className="p-6 border-2 border-slate-100 rounded-[2rem] hover:border-green-500 hover:bg-green-50 transition-all group"
                  >
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <div className="font-black group-hover:text-green-600">{type.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 space-y-6">
              {/* Toolbar Editor */}
              <div className="flex flex-wrap gap-2 pb-4 border-b">
                <button onClick={() => addTextFormat('**')} className="p-2 hover:bg-slate-100 rounded font-bold">B</button>
                <button onClick={() => addTextFormat('*')} className="p-2 hover:bg-slate-100 rounded italic">I</button>
                <button onClick={() => addTextFormat('Σ')} className="p-2 hover:bg-slate-100 rounded">Σ</button>
                <button onClick={() => addTextFormat('√')} className="p-2 hover:bg-slate-100 rounded">√</button>
                <select 
                  className="ml-auto bg-slate-100 rounded-lg px-3 py-1 font-bold text-sm"
                  value={editingQ.timeLimit}
                  onChange={(e) => setEditingQ({...editingQ, timeLimit: Number(e.target.value)})}
                >
                  <option value={10}>10 Sec</option>
                  <option value={30}>30 Sec</option>
                  <option value={60}>1 Min</option>
                </select>
              </div>

              {/* Input Soal */}
              <textarea 
                placeholder="Type your question here..."
                className="w-full text-xl font-bold p-4 bg-slate-50 rounded-2xl outline-none min-h-[120px] focus:bg-white border-2 border-transparent focus:border-green-500 transition-all"
                value={editingQ.text}
                onChange={(e) => setEditingQ({...editingQ, text: e.target.value})}
              />

              {/* Media Upload Area */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50">
                {editingQ.media ? (
                  <div className="relative group">
                    <img src={editingQ.media} alt="Preview" className="max-h-48 rounded-xl" />
                    <button onClick={() => setEditingQ({...editingQ, media: null})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 text-slate-400 hover:text-green-600 transition">
                    <span className="text-3xl">🖼️</span>
                    <span className="font-bold">Find and Insert Media (Upload File)</span>
                  </button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleMediaUpload} accept="image/*,video/*" />
              </div>

              {/* Options Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editingQ.options.map((opt, idx) => (
                  <div key={idx} className={`relative flex items-center p-2 rounded-2xl border-2 transition-all ${editingQ.correctAnswers.includes(idx) ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}>
                    <div 
                      onClick={() => toggleAnswer(idx)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer mr-3 font-bold text-white transition-all ${editingQ.correctAnswers.includes(idx) ? 'bg-green-500' : 'bg-slate-200'}`}
                    >
                      {editingQ.correctAnswers.includes(idx) ? '✓' : idx + 1}
                    </div>
                    <input 
                      type="text" 
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 bg-transparent py-3 outline-none font-bold"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...editingQ.options];
                        newOpts[idx] = e.target.value;
                        setEditingQ({...editingQ, options: newOpts});
                      }}
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={saveQuestion}
                className="w-full bg-black text-white py-5 rounded-[2rem] font-black text-xl hover:bg-slate-800 transition active:scale-95"
              >
                SAVE QUESTION
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}