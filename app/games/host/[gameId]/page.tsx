"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

interface Student {
  id: string;
  name: string;
  score: number;
  lastActive: number;
}

export default function HostLive() {
  const { gameId } = useParams();
  const router = useRouter();
  const [gameData, setGameData] = useState<any>(null);
  const [gameCode, setGameCode] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'ended'>('waiting');

  useEffect(() => {
    // 1. Ambil data game dari Library (LocalStorage)
    const library = JSON.parse(localStorage.getItem('game_library') || '[]');
    const currentGame = library.find((g: any, index: number) => index.toString() === gameId);
    
    if (currentGame) {
      setGameData(currentGame);
      // 2. Generate Random Code (Contoh: BIO-8821)
      const randomCode = "BIO-" + Math.floor(1000 + Math.random() * 9000);
      setGameCode(randomCode);
    }
  }, [gameId]);

  // Simulasi siswa masuk (Hanya untuk demo, nanti diganti data Firebase)
  const simulateStudentJoin = () => {
    const names = ["Andi", "Budi", "Citra", "Dewi"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newStudent = {
      id: Math.random().toString(),
      name: randomName + " " + Math.floor(Math.random() * 100),
      score: 0,
      lastActive: Date.now()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const startGame = () => setGameState('playing');
  const endGame = () => setGameState('ended');

  if (!gameData) return <div className="p-10 text-center">Loading Game...</div>;

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 font-sans overflow-hidden flex flex-col">
      {/* Header Info */}
      <header className="flex justify-between items-center mb-8 bg-slate-800/50 p-6 rounded-[2rem] border border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-green-400">HOSTING: {gameData.name}</h1>
          <p className="text-slate-400 text-sm">Total Soal: {gameData.questions.length}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase tracking-widest">Game Code</div>
          <div className="text-4xl font-black text-white">{gameCode}</div>
        </div>
      </header>

      {/* Main Board */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Kolom Kiri: Stats & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 text-center">
            <div className="text-5xl font-black mb-2 text-sky-400">{students.length}</div>
            <div className="text-slate-400 font-bold uppercase text-xs tracking-widest">Players Joined</div>
            
            {gameState === 'waiting' && (
              <button 
                onClick={startGame}
                className="w-full mt-8 bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-black text-xl shadow-lg transition-all animate-pulse"
              >
                START GAME
              </button>
            )}

            {gameState === 'playing' && (
              <button 
                onClick={endGame}
                className="w-full mt-8 bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl font-black transition-all"
              >
                END GAME
              </button>
            )}
          </div>

          <button onClick={simulateStudentJoin} className="w-full py-2 text-xs text-slate-500 border border-slate-700 rounded-xl hover:bg-slate-800 transition">
             Debug: Simulate Join
          </button>
        </div>

        {/* Kolom Kanan: Leaderboard / Waiting Room */}
        <div className="lg:col-span-3 bg-white/5 rounded-[3rem] p-8 border border-white/10 overflow-y-auto">
          {gameState === 'waiting' ? (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Waiting for students to join...
              </h2>
              <div className="flex flex-wrap gap-4">
                {students.map(s => (
                  <div key={s.id} className="bg-slate-800 px-6 py-3 rounded-full border border-slate-700 font-bold animate-in fade-in zoom-in duration-300">
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          ) : gameState === 'playing' ? (
            <div>
               <h2 className="text-2xl font-bold mb-6 text-sky-400 flex justify-between">
                 <span>LIVE SCOREBOARD</span>
                 <span className="text-sm text-slate-400 italic">Anti-Cheating Active 🛡️</span>
               </h2>
               <div className="space-y-3">
                  {students.sort((a,b) => b.score - a.score).map((s, index) => (
                    <div key={s.id} className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                       <div className="w-10 h-10 flex items-center justify-center font-black bg-slate-700 rounded-xl">{index + 1}</div>
                       <div className="flex-1 font-bold">{s.name}</div>
                       <div className="text-green-400 font-black">{s.score} pts</div>
                    </div>
                  ))}
               </div>
            </div>
          ) : (
            <div className="text-center py-20">
               <div className="text-8xl mb-6">🏆</div>
               <h2 className="text-4xl font-black mb-2">GAME OVER</h2>
               <p className="text-slate-400 mb-8">Peringkat 3 Besar akan muncul di layar siswa.</p>
               <button onClick={() => router.push('/games')} className="bg-white text-black px-10 py-3 rounded-full font-bold">Close Session</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}