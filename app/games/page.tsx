"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GamesPage() {
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [gameCode, setGameCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/');
    }
  }, []);

  const t = {
    id: {
      teacherTitle: "Game Management (Guru)",
      studentTitle: "Mainkan Game (Siswa)",
      create: "Buat Game Baru",
      library: "Library Game",
      recent: "Game Terkini",
      aiGen: "BIOscope AI Generator",
      blank: "Blank Canvas",
      placeholder: "Masukkan Kode Game",
      play: "Main Sekarang",
    },
    en: {
      teacherTitle: "Game Management (Teacher)",
      studentTitle: "Play Game (Student)",
      create: "Create New Game",
      library: "Game Library",
      recent: "Recent Games",
      aiGen: "BIOscope AI Generator",
      blank: "Blank Canvas",
      placeholder: "Enter Game Code",
      play: "Play Now",
    }
  }[lang];

  if (!user) return null;

  // --- TAMPILAN GURU ---
  if (user.role === 'teacher') {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-black">
        <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-green-600 tracking-tighter">BIOscope Games</h1>
            <p className="text-slate-500">{t.teacherTitle}</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="font-bold text-slate-400">← Back</button>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom Create */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6">{t.create}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => router.push('/games/create-scratch')}
                  className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                >
                  <div className="text-3xl mb-2">🎨</div>
                  <div className="font-bold group-hover:text-green-600">{t.blank}</div>
                  <div className="text-xs text-slate-400">Buat soal manual satu-per-satu</div>
                </button>
                <button 
                  className="p-6 bg-slate-900 rounded-3xl text-white hover:bg-slate-800 transition-all text-left"
                >
                  <div className="text-3xl mb-2">🪄</div>
                  <div className="font-bold text-sky-400">{t.aiGen}</div>
                  <div className="text-xs text-slate-400">Buat soal otomatis dengan AI</div>
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-4">{t.recent}</h2>
              <div className="text-slate-400 text-sm italic">Belum ada game yang dimainkan baru-baru ini.</div>
            </div>
          </div>

          {/* Kolom Library */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl font-bold">{t.library}</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-400 text-sm">
                Library kosong. Simpan game untuk melihatnya di sini.
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --- TAMPILAN SISWA ---
  return (
    <main className="min-h-screen bg-green-600 flex items-center justify-center p-6 text-white text-center">
       <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl text-black">
             <div className="text-6xl mb-6">🎮</div>
             <h1 className="text-2xl font-black mb-2">{t.studentTitle}</h1>
             <p className="text-slate-500 mb-8 text-sm italic">Minta kode akses dari gurumu untuk bergabung!</p>
             
             <div className="space-y-4">
                <input 
                  type="text" 
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  placeholder={t.placeholder}
                  className="w-full p-5 bg-slate-100 rounded-2xl text-center text-2xl font-mono font-bold outline-none border-2 border-transparent focus:border-green-500 transition-all"
                />
                <button className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all">
                  {t.play}
                </button>
             </div>
             <button onClick={() => router.push('/dashboard')} className="mt-8 text-slate-400 font-bold block w-full text-center">Kembali</button>
          </div>
       </div>
    </main>
  );
}