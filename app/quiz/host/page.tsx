"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  score: number;
  correctAnswers: number;
  timeSpent: string;
  rank: number;
}

export default function HostLive() {
  const { gameId } = useParams();
  const router = useRouter();
  const [gameData, setGameData] = useState<any>(null);
  const [gameCode, setGameCode] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'ended'>('waiting');

  useEffect(() => {
    const library = JSON.parse(localStorage.getItem('game_library') || '[]');
    // Pastikan indexing sesuai dengan cara Anda menyimpan data
    const currentGame = library.find((g: any, index: number) => index.toString() === gameId || g.id?.toString() === gameId);
    
    if (currentGame) {
      setGameData(currentGame);
      // Generate kode unik jika belum ada
      const timeCode = Date.now().toString().slice(-6);
      setGameCode(`BIO-${timeCode}`);
    }
  }, [gameId]);

  // Simulasi data dashboard yang lebih detail
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
    setStudents(prev => [...prev, newStudent]);
  };

  const startGame = () => {
    if (students.length === 0) return alert("Tunggu setidaknya 1 siswa bergabung!");
    setGameState('playing');
  };
  
  const endGame = () => setGameState('ended');

  // Urutkan siswa berdasarkan score tertinggi
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  if (!gameData) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-black italic animate-pulse">
      LOADING SESSION...
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0f172a] text-white p-6 font-sans flex flex-col overflow-hidden">
      
      {/* HEADER: Info Kuis & Join Code */}
      <header className="flex justify-between items-center mb-8 bg-white/5 p-6 rounded-[2rem] border-4 border-black shadow-[8px_8px_0_0_#000]">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500 p-3 rounded-xl border-2 border-black">🎮</div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Host Dashboard</span>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">{gameData.name}</h1>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black uppercase opacity-50">Join di: bioscope.app</p>
            <p className="text-xs font-bold text-yellow-400">Gunakan Kode Berikut 👇</p>
          </div>
          <div className="bg-yellow-400 px-6 py-3 rounded-2xl border-4 border-black shadow-[4px_4px_0_0_#000] text-black">
            <div className="text-4xl font-black tracking-tighter">{gameCode}</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1">
        
        {/* SIDEBAR: Controls & Stats */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0_0_#000] text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-7xl font-black mb-1">{students.length}</div>
              <div className="text-xs font-black uppercase tracking-widest opacity-80 mb-6">Siswa Bergabung</div>
              
              {gameState === 'waiting' && (
                <button 
                  onClick={startGame}
                  disabled={students.length === 0}
                  className={`w-full py-4 rounded-2xl font-black text-xl transition-all border-4 border-black shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-y-1
                    ${students.length > 0 
                      ? 'bg-white text-black hover:bg-yellow-400 cursor-pointer' 
                      : 'bg-slate-400 text-slate-600 cursor-not-allowed grayscale'}`}
                >
                  {students.length > 0 ? 'START GAME ▶️' : 'MENUNGGU SISWA...'}
                </button>
              )}

              {gameState === 'playing' && (
                <button 
                  onClick={endGame}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-black hover:bg-red-600 border-4 border-black shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-y-1 transition-all"
                >
                  AKHIRI SESI 🛑
                </button>
              )}
            </div>
            {/* Background Decor */}
            <div className="absolute -bottom-4 -right-4 text-white/10 text-9xl font-black italic select-none">LIVE</div>
          </div>

          <button 
            onClick={simulateStudentJoin} 
            className="w-full py-3 text-[10px] font-black text-slate-400 border-4 border-dashed border-slate-700 rounded-2xl hover:border-indigo-500 hover:text-indigo-400 transition-all uppercase italic"
          >
            + Simulasi Siswa Join
          </button>
        </div>

        {/* MAIN AREA: Dashboard / Podium */}
        <div className="col-span-12 lg:col-span-9 bg-black/40 rounded-[3rem] border-4 border-black p-8 relative overflow-y-auto">
          
          {/* VIEW 1: LOBBY TUNGGU */}
          {gameState === 'waiting' && (
            <div className="h-full flex flex-col">
              <h2 className="text-2xl font-black italic mb-8 uppercase text-indigo-300">Lobby Peserta</h2>
              {students.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-white/5 rounded-[2rem]">
                  <div className="text-6xl animate-bounce mb-4">📱</div>
                  <p className="font-bold text-slate-500 italic">Berikan kode di atas kepada siswa Anda...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {students.map(s => (
                    <div key={s.id} className="bg-white text-black p-4 rounded-2xl font-black text-center border-4 border-black shadow-[4px_4px_0_0_#4f46e5] animate-in zoom-in duration-300">
                      {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: LEADERBOARD LIVE */}
          {gameState === 'playing' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-black italic uppercase text-green-400">Live Leaderboard</h2>
                <span className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-[10px] font-black animate-pulse uppercase">Game In Progress</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <th className="px-6">Posisi</th>
                      <th className="px-6">Nama Siswa</th>
                      <th className="px-6">Akurasi</th>
                      <th className="px-6 text-center">Durasi</th>
                      <th className="px-6 text-right">Skor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((s, idx) => (
                      <tr key={s.id} className="bg-white/5 border-2 border-white/10 rounded-2xl transition-all hover:bg-white/10 group">
                        <td className="px-6 py-4 font-black text-2xl italic group-hover:text-indigo-400">#{idx + 1}</td>
                        <td className="px-6 py-4 font-bold text-lg">{s.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-mono text-green-400">
                            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${(s.correctAnswers/10)*100}%` }}></div>
                            </div>
                            {s.correctAnswers} ✅
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-slate-400">{s.timeSpent}</td>
                        <td className="px-6 py-4 text-right font-black text-xl text-yellow-400">{s.score.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 3: PODIUM PEMENANG */}
          {gameState === 'ended' && (
            <div className="h-full flex flex-col items-center justify-center animate-in slide-in-from-bottom-10 duration-700">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-5xl font-black italic mb-12 tracking-tighter uppercase text-center">
                The Winner Is...
              </h2>
              
              <div className="flex items-end gap-2 md:gap-6 h-64 px-4">
                {/* 2nd Place */}
                {sortedStudents[1] && (
                  <div className="flex flex-col items-center animate-in slide-in-from-left duration-1000">
                    <div className="text-[10px] font-black mb-2 truncate w-24 text-center">{sortedStudents[1].name}</div>
                    <div className="bg-slate-400 w-24 md:w-32 h-32 border-4 border-black flex items-center justify-center text-4xl font-black shadow-[6px_6px_0_0_#000] text-black">2</div>
                  </div>
                )}
                {/* 1st Place */}
                {sortedStudents[0] && (
                  <div className="flex flex-col items-center scale-110 z-10">
                    <div className="text-lg font-black text-yellow-400 mb-2 animate-bounce">👑 {sortedStudents[0].name}</div>
                    <div className="bg-yellow-400 w-32 md:w-44 h-48 border-4 border-black flex flex-col items-center justify-center text-black shadow-[10px_10px_0_0_#000]">
                      <span className="text-7xl font-black">1</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{sortedStudents[0].score} PTS</span>
                    </div>
                  </div>
                )}
                {/* 3rd Place */}
                {sortedStudents[2] && (
                  <div className="flex flex-col items-center animate-in slide-in-from-right duration-1000">
                    <div className="text-[10px] font-black mb-2 truncate w-24 text-center">{sortedStudents[2].name}</div>
                    <div className="bg-orange-700 w-24 md:w-32 h-24 border-4 border-black flex items-center justify-center text-4xl font-black shadow-[6px_6px_0_0_#000] text-black">3</div>
                  </div>
                )}
              </div>

              <div className="mt-16 flex gap-4">
                <button 
                  onClick={() => router.push('/quiz')}
                  className="px-8 py-4 bg-white text-black font-black rounded-2xl border-4 border-black hover:bg-yellow-400 transition-all shadow-[4px_4px_0_0_#000] uppercase italic"
                >
                  Keluar Sesi
                </button>
                <button 
                  className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl border-4 border-black hover:bg-indigo-500 transition-all shadow-[4px_4px_0_0_#000] uppercase italic"
                >
                  Simpan Laporan PDF 📄
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}