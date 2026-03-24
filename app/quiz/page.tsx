"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Komponen utama dipisah supaya bisa pakai Suspense untuk searchParams
function QuizContent() {
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [gameCode, setGameCode] = useState('');
  const [library, setLibrary] = useState<any[]>([]);
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showHostModal, setShowHostModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedLibrary = localStorage.getItem('game_library');
    const autoCode = searchParams.get('code');

    if (storedUser) setUser(JSON.parse(storedUser));
    else router.push('/');

    if (storedLibrary) setLibrary(JSON.parse(storedLibrary));
    if (autoCode) setGameCode(autoCode.toUpperCase());
  }, [searchParams]);

  // FIX 1: Generate Kode (Format BIO-XXXX)
  const handleHostLive = (quiz: any) => {
    const code = `BIO-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedCode(code);
    setSelectedQuiz(quiz);
    setShowHostModal(true);
  };

  // FIX 2: Tombol MULAI (Mencegah 404)
  const confirmStartHost = () => {
    if (!selectedQuiz) return;
    
    const sessionInfo = {
      code: generatedCode,
      quizId: selectedQuiz.id,
      gameName: selectedQuiz.name,
      questions: selectedQuiz.questions,
      status: 'waiting',
      hostName: user.name,
      startTime: Date.now()
    };
    
    // Simpan ke localStorage agar bisa diakses di halaman host
    localStorage.setItem(`active_session_${generatedCode}`, JSON.stringify(sessionInfo));
    
    // Gunakan path yang flat saja supaya tidak pusing dengan [id] jika belum dibuat
    // Pastikan Ibu punya folder: app/quiz/host/page.tsx
    router.push(`/quiz/host?code=${generatedCode}`);
  };

  // FIX 3: Join Logic untuk Siswa
  const handleStudentJoin = () => {
    const code = gameCode.trim().toUpperCase();
    if (!code) return alert("Masukkan kode dulu, yuk!");
    
    const sessionData = localStorage.getItem(`active_session_${code}`);
    
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session.status === 'ended') {
        alert("Yah, kuis ini sudah selesai!");
      } else {
        localStorage.setItem('current_play_session', sessionData);
        // Pastikan Ibu punya folder: app/quiz/play/page.tsx
        router.push(`/quiz/play?code=${code}`); 
      }
    } else {
      alert("Kode kuis tidak ditemukan. Guru mungkin belum menekan tombol 'Mulai'.");
    }
  };

  // ... (Logika Assign, Edit, Delete tetap sama)
  const handleOpenAssign = (quiz: any) => { setSelectedQuiz(quiz); setShowAssignModal(true); };
  const confirmAssign = () => {
    const code = `HW-${Math.floor(1000 + Math.random() * 9000)}`;
    alert(`Kuis Berhasil di-PR-kan!\nKODE: ${code}`);
    setShowAssignModal(false);
  };
  const handleEdit = (quiz: any) => {
    localStorage.setItem('editing_now', JSON.stringify(quiz));
    router.push('/quiz/create-scratch'); 
  };
  const deleteQuiz = (id: any) => {
    if (confirm("Hapus draft soal ini?")) {
      const updated = library.filter(q => q.id !== id);
      setLibrary(updated);
      localStorage.setItem('game_library', JSON.stringify(updated));
    }
  };

  const t = {
    id: { host: "HOST LIVE", hostDesc: "Main bersama", library: "Library Saya", create: "Buat Kuis Baru", blank: "Blank Canvas", aiGen: "AI Generator", assign: "ASSIGN HW", assignDesc: "PR Mandiri" },
    en: { host: "HOST LIVE", hostDesc: "Play together", library: "My Library", create: "Create New Quiz", blank: "Blank Canvas", aiGen: "AI Generator", assign: "ASSIGN HW", assignDesc: "Homework" }
  }[lang];

  if (!user) return null;

  // --- RENDER TEACHER ---
  if (user.role === 'teacher') {
    return (
      <main className="min-h-screen bg-[#f8fafc] p-6 md:p-10 text-black font-sans relative">
        {/* MODAL HOST */}
        {showHostModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black w-full max-w-sm rounded-[2rem] p-6 text-center shadow-[10px_10px_0_0_#000]">
              <div className="inline-block px-4 py-1 bg-red-500 text-white font-black rounded-full mb-4 text-xs animate-pulse">LIVE SESSION</div>
              <h2 className="text-xl font-black uppercase italic mb-2">Siap Main?</h2>
              <p className="text-[10px] font-bold text-slate-400 mb-4 uppercase">Siswa join pakai kode ini:</p>
              <div className="bg-indigo-50 border-4 border-black p-4 rounded-2xl mb-6 shadow-[4px_4px_0_0_#4f46e5]">
                <span className="text-4xl font-black tracking-tight text-indigo-600">{generatedCode}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowHostModal(false)} className="flex-1 py-3 font-black border-2 border-black rounded-xl hover:bg-slate-100 transition-all text-xs">BATAL</button>
                <button onClick={confirmStartHost} className="flex-1 py-3 bg-indigo-600 text-white font-black border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] hover:translate-y-0.5 transition-all text-xs">MULAI 🚀</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ASSIGN */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black w-full max-w-sm rounded-[2rem] p-6 shadow-[10px_10px_0_0_#6366f1]">
              <h2 className="text-lg font-black uppercase italic mb-4">📅 Pengaturan PR</h2>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAssignModal(false)} className="flex-1 py-2 font-black border-2 border-black rounded-xl text-xs">BATAL</button>
                <button onClick={confirmAssign} className="flex-1 py-2 bg-indigo-600 text-white font-black border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000] text-xs">SIMPAN</button>
              </div>
            </div>
          </div>
        )}

        <header className="max-w-7xl mx-auto flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900">Bioscope <span className="text-indigo-600">Quiz</span></h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Management Dashboard</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="px-6 py-2 bg-white border-4 border-black font-black shadow-[4px_4px_0_0_#000] hover:translate-y-1 transition-all">← BACK</button>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7">
             <section className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[10px_10px_0_0_#000]">
                <h2 className="text-2xl font-black uppercase italic mb-6">{t.create}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <button onClick={() => router.push('/quiz/create-scratch')} className="p-8 bg-indigo-600 rounded-[2rem] border-4 border-black shadow-[6px_6px_0_0_#000] text-left hover:brightness-110 transition-all group">
                     <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📄</div>
                     <div className="text-white uppercase italic font-black text-2xl tracking-tight leading-none mb-1">{t.blank}</div>
                     <p className="text-white/80 text-[11px] font-bold">Mulai kuis dari awal</p>
                   </button>
                   <button className="p-8 bg-slate-200 rounded-[2rem] border-4 border-black shadow-[6px_6px_0_0_#000] text-left opacity-60 cursor-not-allowed">
                     <div className="text-4xl mb-4 grayscale">✨</div>
                     <div className="text-slate-900 uppercase italic font-black text-2xl tracking-tight leading-none mb-1">{t.aiGen}</div>
                     <p className="text-slate-600 text-[11px] font-bold italic">Segera Hadir</p>
                   </button>
                </div>
             </section>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <aside className="bg-yellow-400 border-4 border-black p-6 rounded-[3rem] shadow-[10px_10px_0_0_#000]">
              <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-2">📚 {t.library}</h2>
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {library.length === 0 ? (
                  <div className="text-center py-10 border-2 border-black border-dashed rounded-2xl bg-white/50">
                    <p className="font-black uppercase italic text-slate-500">Belum ada kuis</p>
                  </div>
                ) : library.map((quiz) => (
                  <div key={quiz.id} className="bg-white border-4 border-black p-5 rounded-2xl shadow-[5px_5px_0_0_#000]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="max-w-[70%]">
                        <div className="font-black uppercase text-lg leading-tight truncate text-indigo-600">{quiz.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 italic">🚀 {quiz.questions?.length || 0} SOAL</div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(quiz)} className="p-2 bg-blue-50 border-2 border-black rounded-lg">✏️</button>
                        <button onClick={() => deleteQuiz(quiz.id)} className="p-2 bg-red-50 border-2 border-black rounded-lg">🗑️</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleHostLive(quiz)} className="py-2.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 transition-all">
                        🔴 {t.host}
                      </button>
                      <button onClick={() => handleOpenAssign(quiz)} className="py-2.5 bg-white text-black text-[10px] font-black rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 transition-all">
                        📅 {t.assign}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  // --- RENDER STUDENT ---
  return (
    <main className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 text-center font-sans">
       <div className="bg-white p-10 rounded-[4rem] border-8 border-black shadow-[20px_20px_0_0_#000] w-full max-w-md">
          <h1 className="text-4xl font-black uppercase italic mb-8 tracking-tighter leading-none">Bioscope <span className="text-indigo-600">Join</span></h1>
          <div className="space-y-4">
            <input 
              type="text" 
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="CONTOH: BIO-1234"
              className="w-full p-6 bg-slate-100 border-4 border-black rounded-3xl text-3xl font-black text-center focus:bg-yellow-300 outline-none transition-all"
            />
            <button 
              onClick={handleStudentJoin}
              className="w-full py-6 bg-indigo-600 text-white border-4 border-black rounded-3xl font-black text-2xl shadow-[6px_6px_0_0_#000] hover:translate-y-1 transition-all"
            >
              GABUNG SEKARANG
            </button>
          </div>
          <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase italic">Tunggu instruksi dari gurumu!</p>
       </div>
    </main>
  );
}

// Wrapper dengan Suspense untuk Vercel
export default function GamesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold">Loading...</div>}>
      <QuizContent />
    </Suspense>
  );
}