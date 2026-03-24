"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  score: number;
  correctAnswers: number;
  timeSpent: string;
  rank: number;
}

function HostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromURL = searchParams.get('code'); // Ambil BIO-XXXX dari URL

  const [gameData, setGameData] = useState<any>(null);
  const [gameCode, setGameCode] = useState(codeFromURL || '');
  const [students, setStudents] = useState<Student[]>([]);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'ended'>('waiting');

  // 1. INISIALISASI SESI HOST BERDASARKAN KODE
  useEffect(() => {
    if (!codeFromURL) {
       // Jika masuk tanpa kode, tendang balik ke dashboard kuis
       router.push('/quiz');
       return;
    }

    // Ambil data sesi yang tadi dibuat di GamesPage
    const sessionData = localStorage.getItem(`active_session_${codeFromURL}`);
    
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      setGameData({
        name: parsedSession.gameName,
        questions: parsedSession.questions
      });
      setGameCode(codeFromURL);
    } else {
      // Jika data tidak ada di localStorage, mungkin terpukul refresh/clear cache
      alert("Sesi tidak ditemukan!");
      router.push('/quiz');
    }
  }, [codeFromURL, router]);

  // 2. LOGIKA MENDETEKSI SISWA (Tetap sama, sudah bagus)
  useEffect(() => {
    if (gameState === 'waiting' && gameCode) {
      const interval = setInterval(() => {
        const participants = JSON.parse(localStorage.getItem(`participants_${gameCode}`) || '[]');
        if (participants.length !== students.length) {
          setStudents(participants);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [gameCode, students, gameState]);

  // 3. FUNGSI-FUNGSI AKSI (Start, End, Simulate)
  const simulateStudentJoin = () => {
    const names = ["Andi", "Budi", "Citra", "Dewi", "Eka", "Farhan", "Gita", "Hadi"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newStudent: Student = {
      id: Math.random().toString(),
      name: `${randomName} #${Math.floor(Math.random() * 99)}`,
      score: Math.floor(Math.random() * 5000),
      correctAnswers: Math.floor(Math.random() * 10),
      timeSpent: `${Math.floor(Math.random() * 5)}m ${Math.floor(Math.random() * 60)}s`,
      rank: 0
    };
    
    const newBatch = [...students, newStudent];
    setStudents(newBatch);
    localStorage.setItem(`participants_${gameCode}`, JSON.stringify(newBatch));
  };

  const startGame = () => {
    if (students.length === 0) return alert("Tunggu setidaknya 1 siswa bergabung!");
    setGameState('playing');
    const session = JSON.parse(localStorage.getItem(`active_session_${gameCode}`) || '{}');
    localStorage.setItem(`active_session_${gameCode}`, JSON.stringify({...session, status: 'playing'}));
  };
  
  const endGame = () => {
    setGameState('ended');
    const session = JSON.parse(localStorage.getItem(`active_session_${gameCode}`) || '{}');
    localStorage.setItem(`active_session_${gameCode}`, JSON.stringify({...session, status: 'ended'}));
  };

  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  if (!gameData) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-black italic animate-pulse text-2xl">
      MENYIAPKAN RUANG KUIS...
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0f172a] text-white p-6 font-sans flex flex-col overflow-hidden">
      {/* HEADER: Sama seperti kode Ibu tapi dengan binding data yang benar */}
      <header className="flex justify-between items-center mb-8 bg-white/5 p-6 rounded-[2rem] border-4 border-black shadow-[8px_8px_0_0_#000]">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500 p-3 rounded-xl border-2 border-black text-2xl">🎮</div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Host Live Dashboard</span>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">{gameData.name}</h1>
          </div>
        </div>
        
        <div className="flex gap-6 items-center bg-black/40 p-4 rounded-3xl border-2 border-white/10">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black uppercase opacity-50">Join di perangkat lain:</p>
            <p className="text-xs font-bold text-yellow-400 italic">Gunakan Kode Akses Ini</p>
          </div>
          <div className="bg-yellow-400 px-8 py-3 rounded-2xl border-4 border-black shadow-[4px_4px_0_0_#000] text-black group relative cursor-pointer active:scale-95 transition-transform">
            <div className="text-4xl font-black tracking-tighter">{gameCode}</div>
            <div className="absolute -top-3 -right-3 bg-white text-[8px] px-2 py-1 rounded-full border-2 border-black font-black animate-bounce text-indigo-600">LIVE</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0_0_#000] text-center relative overflow-hidden">
            <div className="text-7xl font-black mb-1">{students.length}</div>
            <div className="text-xs font-black uppercase tracking-widest opacity-80 mb-6">Siswa Terhubung</div>
            
            {gameState === 'waiting' && (
              <button onClick={startGame} className={`w-full py-5 rounded-2xl font-black text-xl transition-all border-4 border-black shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-y-1 ${students.length > 0 ? 'bg-white text-black' : 'bg-slate-400 text-slate-600 grayscale opacity-50'}`}>
                {students.length > 0 ? 'MULAI KUIS SEKARANG ▶️' : 'MENUNGGU SISWA...'}
              </button>
            )}

            {gameState === 'playing' && (
              <button onClick={endGame} className="w-full bg-red-500 text-white py-5 rounded-2xl font-black border-4 border-black shadow-[4px_4px_0_0_#000]">
                STOP & LIHAT HASIL 🛑
              </button>
            )}
          </div>

          <button onClick={simulateStudentJoin} className="w-full py-4 text-[10px] font-black text-slate-400 border-4 border-dashed border-slate-700 rounded-2xl hover:border-indigo-500 transition-all uppercase flex flex-col items-center">
            <span>+ Klik simulasi siswa join</span>
          </button>
        </div>

        {/* MAIN AREA: Leaderboard / Podium (Kode Ibu sudah Bagus!) */}
        <div className="col-span-12 lg:col-span-9 bg-black/40 rounded-[3rem] border-4 border-black p-8 relative overflow-y-auto min-h-[500px]">
          {/* ... Bagian Kondisi gameState 'waiting', 'playing', 'ended' (Salin dari kode Ibu) ... */}
          {/* (Saya tidak tulis ulang semua agar tidak terlalu panjang, tapi logika UI Ibu sudah oke) */}
        </div>
      </div>
    </main>
  );
}

// WRAPPER UNTUK VERCEL
export default function HostLive() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading...</div>}>
      <HostContent />
    </Suspense>
  );
}