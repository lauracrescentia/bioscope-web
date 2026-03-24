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

  // 1. INISIALISASI SESI HOST
  useEffect(() => {
    const library = JSON.parse(localStorage.getItem('game_library') || '[]');
    const currentGame = library.find((g: any, index: number) => 
      index.toString() === gameId || g.id?.toString() === gameId
    );
    
    if (currentGame) {
      setGameData(currentGame);
      
      // Buat Kode Unik (4 digit terakhir dari timestamp)
      const code = `BIO-${Date.now().toString().slice(-4)}`;
      setGameCode(code);

      // SIMPAN KE GLOBAL SESSION (Agar bisa ditemukan di halaman Join)
      const sessionInfo = {
        code: code,
        gameName: currentGame.name,
        questions: currentGame.questions,
        status: 'waiting',
        hostId: 'admin-1' // Dummy ID
      };
      
      // Simpan di LocalStorage dengan key khusus kode tersebut
      localStorage.setItem(`active_session_${code}`, JSON.stringify(sessionInfo));
      
      // Juga update daftar sesi yang sedang running secara umum
      const activeSessions = JSON.parse(localStorage.getItem('active_sessions_list') || '[]');
      localStorage.setItem('active_sessions_list', JSON.stringify([...activeSessions, code]));
    }

    // Cleanup: Jika halaman ditutup, sesi dianggap berakhir (Opsional)
    return () => {
      // localStorage.removeItem(`active_session_${gameCode}`);
    };
  }, [gameId]);

  // 2. LOGIKA MENDETEKSI SISWA REAL (Auto-Refresh Daftar Siswa)
  useEffect(() => {
    if (gameState === 'waiting' && gameCode) {
      const interval = setInterval(() => {
        // Cek apakah ada data partisipan baru untuk kode ini
        const participants = JSON.parse(localStorage.getItem(`participants_${gameCode}`) || '[]');
        if (participants.length !== students.length) {
          setStudents(participants);
        }
      }, 2000); // Cek setiap 2 detik

      return () => clearInterval(interval);
    }
  }, [gameCode, students, gameState]);

  // Simulasi untuk keperluan demo cepat
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
    // Simpan hasil simulasi ke "cloud" lokal juga
    localStorage.setItem(`participants_${gameCode}`, JSON.stringify(newBatch));
  };

  const startGame = () => {
    if (students.length === 0) return alert("Tunggu setidaknya 1 siswa bergabung!");
    setGameState('playing');
    
    // Update status sesi agar siswa yang baru mau join tahu game sudah mulai
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
      
      {/* HEADER: Area Kode yang Sangat Jelas */}
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
        
        {/* SIDEBAR: Status & Tombol Utama */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0_0_#000] text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-7xl font-black mb-1">{students.length}</div>
              <div className="text-xs font-black uppercase tracking-widest opacity-80 mb-6">Siswa Terhubung</div>
              
              {gameState === 'waiting' && (
                <button 
                  onClick={startGame}
                  className={`w-full py-5 rounded-2xl font-black text-xl transition-all border-4 border-black shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-y-1
                    ${students.length > 0 
                      ? 'bg-white text-black hover:bg-yellow-400' 
                      : 'bg-slate-400 text-slate-600 grayscale opacity-50 cursor-not-allowed'}`}
                >
                  {students.length > 0 ? 'MULAI KUIS SEKARANG ▶️' : 'MENUNGGU SISWA...'}
                </button>
              )}

              {gameState === 'playing' && (
                <button 
                  onClick={endGame}
                  className="w-full bg-red-500 text-white py-5 rounded-2xl font-black hover:bg-red-600 border-4 border-black shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-y-1 transition-all"
                >
                  STOP & LIHAT HASIL 🛑
                </button>
              )}
            </div>
          </div>

          <button 
            onClick={simulateStudentJoin} 
            className="w-full py-4 text-[10px] font-black text-slate-400 border-4 border-dashed border-slate-700 rounded-2xl hover:border-indigo-500 hover:text-indigo-400 transition-all uppercase italic flex flex-col items-center gap-1"
          >
            <span>+ Klik untuk simulasi siswa join otomatis</span>
            <span className="opacity-50">(Gunakan untuk demo jika tidak ada HP lain)</span>
          </button>
        </div>

        {/* MAIN: Area Leaderboard/Lobby */}
        <div className="col-span-12 lg:col-span-9 bg-black/40 rounded-[3rem] border-4 border-black p-8 relative overflow-y-auto min-h-[500px]">
          {gameState === 'waiting' && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black italic uppercase text-indigo-300">Lobby Menunggu Peserta</h2>
                {students.length > 0 && <span className="text-xs font-black text-white/40 animate-pulse">SINKRONISASI AKTIF...</span>}
              </div>
              
              {students.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-white/5 rounded-[3rem] bg-white/5">
                  <div className="text-8xl animate-bounce mb-6">📡</div>
                  <p className="font-black text-xl text-slate-400 italic text-center max-w-sm uppercase">
                    Kuis Siap Dimulai! <br/> Berikan Kode <span className="text-yellow-400">{gameCode}</span> Ke Siswa
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {students.map(s => (
                    <div key={s.id} className="bg-white text-black p-5 rounded-2xl font-black text-lg text-center border-4 border-black shadow-[4px_4px_0_0_#4f46e5] animate-in zoom-in duration-300">
                      {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {gameState === 'playing' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-end mb-8 border-b-4 border-white/10 pb-4">
                <h2 className="text-3xl font-black italic uppercase text-green-400 tracking-tighter">Live Leaderboard</h2>
                <span className="bg-green-500 text-black px-4 py-1 rounded-full text-[10px] font-black animate-pulse uppercase">Sedang Berlangsung</span>
              </div>
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[10px] font-black uppercase text-slate-500 italic">
                    <th className="px-6 pb-2">Pos</th>
                    <th className="px-6 pb-2">Nama Siswa</th>
                    <th className="px-6 pb-2">Akurasi</th>
                    <th className="px-6 pb-2 text-right">Skor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((s, idx) => (
                    <tr key={s.id} className="bg-white/5 border-2 border-white/10 rounded-2xl group">
                      <td className="px-6 py-4 font-black text-2xl italic">#{idx + 1}</td>
                      <td className="px-6 py-4 font-bold text-lg">{s.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                              <div className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]" style={{ width: `${(s.correctAnswers/10)*100}%` }}></div>
                          </div>
                          <span className="font-mono text-green-400 font-bold">{s.correctAnswers} ✅</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-2xl text-yellow-400 group-hover:scale-110 transition-transform">
                        {s.score.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {gameState === 'ended' && (
            <div className="h-full flex flex-col items-center justify-center py-10">
              <div className="text-8xl mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">🏆</div>
              <h2 className="text-6xl font-black italic mb-12 tracking-tighter uppercase text-center leading-none">
                HASIL AKHIR <br/><span className="text-yellow-400">PEMENANG</span>
              </h2>
              
              <div className="flex items-end gap-4 h-64 mb-10">
                {/* 2nd Place */}
                {sortedStudents[1] && (
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] font-black mb-2 text-slate-400 uppercase">{sortedStudents[1].name}</div>
                    <div className="bg-slate-400 w-28 h-32 border-4 border-black flex items-center justify-center text-4xl font-black shadow-[6px_6px_0_0_#000] text-black">2</div>
                  </div>
                )}
                {/* 1st Place */}
                {sortedStudents[0] && (
                  <div className="flex flex-col items-center scale-110">
                    <div className="text-xl font-black text-yellow-400 mb-2 animate-bounce">👑 {sortedStudents[0].name}</div>
                    <div className="bg-yellow-400 w-40 h-48 border-4 border-black flex flex-col items-center justify-center text-black shadow-[10px_10px_0_0_#000]">
                      <span className="text-7xl font-black">1</span>
                      <span className="text-xs font-black uppercase">{sortedStudents[0].score} PTS</span>
                    </div>
                  </div>
                )}
                {/* 3rd Place */}
                {sortedStudents[2] && (
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] font-black mb-2 text-orange-400 uppercase">{sortedStudents[2].name}</div>
                    <div className="bg-orange-700 w-28 h-24 border-4 border-black flex items-center justify-center text-4xl font-black shadow-[6px_6px_0_0_#000] text-black">3</div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => router.push('/quiz')} className="px-10 py-4 bg-white text-black font-black rounded-2xl border-4 border-black hover:bg-yellow-400 transition-all shadow-[4px_4px_0_0_#000] uppercase italic">
                  Tutup Sesi
                </button>
                <button className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl border-4 border-black hover:bg-indigo-500 transition-all shadow-[4px_4px_0_0_#000] uppercase italic">
                  Cetak Raport 📄
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}