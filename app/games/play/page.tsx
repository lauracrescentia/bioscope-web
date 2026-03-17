"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentPlay() {
  const router = useRouter();
  const [step, setStep] = useState<'join' | 'lobby' | 'playing' | 'result'>('join');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [lives, setLives] = useState(10);
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  // --- ANTI CHEATING LOGIC ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && step === 'playing') {
        alert("⚠️ ANTI-CHEAT: Jangan pindah tab! Nyawa berkurang -1.");
        setLives(prev => {
          const newLives = Math.max(0, prev - 1);
          if (newLives === 0) finishGame(score, 0); // Mati jika nyawa habis
          return newLives;
        });
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault(); // Anti klik kanan (AI/Copas)

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [step, score]);

  // Simulasi Timer
  useEffect(() => {
    if (step === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && step === 'playing') {
      nextQuestion();
    }
  }, [timeLeft, step]);

  const nextQuestion = () => {
    if (currentQ >= 4) {
      finishGame(score, lives);
    } else {
      setCurrentQ(prev => prev + 1);
      setTimeLeft(30);
    }
  };

  const finishGame = (finalScore: number, finalLives: number) => {
    // LOGIKA PENYIMPANAN LAPORAN (Untuk Guru)
    const finalReport = {
      name: name || "Anonymous",
      score: finalScore,
      livesRemaining: finalLives,
      gameCode: code.toUpperCase(),
      timestamp: new Date().toLocaleString()
    };
    
    const allReports = JSON.parse(localStorage.getItem('game_reports') || '[]');
    localStorage.setItem('game_reports', JSON.stringify([...allReports, finalReport]));
    
    setStep('result');
  };

  if (step === 'join') {
    return (
      <main className="min-h-screen bg-green-600 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center">
          <h1 className="text-3xl font-black mb-6 text-slate-800">JOIN GAME 🎮</h1>
          <div className="space-y-4">
            <input 
              type="text" placeholder="GAME CODE" 
              className="w-full p-4 bg-slate-100 rounded-2xl text-center text-2xl font-black uppercase outline-none focus:ring-4 ring-green-200"
              value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <input 
              type="text" placeholder="YOUR NAME" 
              className="w-full p-4 bg-slate-100 rounded-2xl text-center font-bold outline-none focus:ring-4 ring-green-200"
              value={name} onChange={(e) => setName(e.target.value)}
            />
            <button 
              onClick={() => name && code ? setStep('lobby') : alert("Isi Nama dan Kode!")}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xl hover:bg-green-600 transition shadow-lg active:scale-95"
            >
              ENTER
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'lobby') {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="animate-bounce text-6xl mb-6">🚀</div>
        <h2 className="text-3xl font-black mb-2">Ready, {name}?</h2>
        <p className="text-slate-400">Menunggu Guru memulai pertandingan...</p>
        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl text-sm italic text-slate-400">
          Tips: Jangan berpindah tab saat bermain atau nyawa berkurang!
        </div>
        <button onClick={() => setStep('playing')} className="mt-10 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-green-400 transition">
          (Simulasi) Mulai Main
        </button>
      </main>
    );
  }

  if (step === 'playing') {
    return (
      <main className="min-h-screen bg-slate-50 text-black p-6 flex flex-col">
        {/* Hud (Lives & Score) */}
        <div className="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl">
            <span className="text-2xl animate-pulse">❤️</span>
            <span className="text-2xl font-black text-red-500">{lives}</span>
          </div>
          <div className="bg-slate-800 text-white px-6 py-2 rounded-full font-mono font-bold text-xl">
            {timeLeft}s
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-xl font-black text-xl text-green-600">
             {score} <span className="text-xs text-green-400 ml-1">pts</span>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 w-full mb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 h-2 bg-green-500 transition-all duration-1000" style={{ width: `${(timeLeft/30)*100}%` }}></div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Question {currentQ + 1} of 5</h2>
            <p className="text-2xl font-bold text-slate-800 leading-relaxed">
              Manakah dari organ berikut yang merupakan bagian dari sistem ekskresi manusia?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {['Paru-paru', 'Ginjal', 'Kulit', 'Semua Benar'].map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  setScore(score + 150);
                  nextQuestion();
                }}
                className="p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] font-bold text-lg hover:border-green-500 hover:bg-green-50 transition-all active:scale-95 text-left flex items-center gap-4 group"
              >
                <span className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-green-500 group-hover:text-white flex items-center justify-center transition-colors">
                  {idx + 1}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-green-600 text-white flex flex-col items-center justify-center p-6 text-center">
       <div className="animate-tada text-8xl mb-6">🏆</div>
       <h1 className="text-5xl font-black mb-2 italic">FINISH!</h1>
       <p className="text-2xl opacity-80 mb-10 font-medium">Luar biasa, {name}! Skor akhirmu adalah:</p>
       
       <div className="bg-white p-10 rounded-[3rem] text-black shadow-2xl w-full max-w-md">
          <div className="text-6xl font-black text-green-600 mb-2">{score}</div>
          <div className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-6">Total Points Earned</div>
          
          <div className="space-y-3">
            <div className="flex justify-between p-4 bg-slate-50 rounded-2xl font-bold">
              <span className="text-slate-500">Sisa Nyawa</span>
              <span className="text-red-500">❤️ {lives}</span>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl font-bold text-green-700">
               Review Jawaban Tersedia
            </div>
          </div>
       </div>

       <button 
         onClick={() => router.push('/dashboard')} 
         className="mt-10 bg-black/20 hover:bg-black/40 px-8 py-3 rounded-full font-bold transition"
       >
         Back to Dashboard
       </button>
    </main>
  );
}