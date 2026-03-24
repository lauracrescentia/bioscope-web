"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Question {
  q: string;
  options: string[];
  correct: number;
}

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromURL = searchParams.get('code') || '';

  // Game States
  const [step, setStep] = useState<'join' | 'lobby' | 'playing' | 'result' | 'review'>('join');
  const [code, setCode] = useState(codeFromURL);
  const [name, setName] = useState('');
  const [lives, setLives] = useState(10);
  const [score, setScore] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isWrongEffect, setIsWrongEffect] = useState(false);

  // REAL DATA FROM HOST
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [quizName, setQuizName] = useState('Bioscope Quiz');

  // 1. SYNC WITH HOST SESSION
  const handleStartPlaying = () => {
    const sessionData = localStorage.getItem(`active_session_${code}`);
    
    if (sessionData) {
      const session = JSON.parse(sessionData);
      
      // Jika Host belum memulai (masih status waiting)
      if (session.status === 'waiting') {
        setStep('lobby');
      } else {
        setQuizData(session.questions || []);
        setQuizName(session.gameName);
        setStep('playing');
        
        // Daftarkan nama siswa ke list peserta Host
        const participants = JSON.parse(localStorage.getItem(`participants_${code}`) || '[]');
        const newParticipant = { id: Date.now().toString(), name: name, score: 0, correctAnswers: 0 };
        localStorage.setItem(`participants_${code}`, JSON.stringify([...participants, newParticipant]));
      }
    } else {
      alert("Kode kuis tidak ditemukan!");
    }
  };

  // 2. POLLING UNTUK LOBBY (Menunggu Host Klik Mulai)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'lobby') {
      interval = setInterval(() => {
        const session = JSON.parse(localStorage.getItem(`active_session_${code}`) || '{}');
        if (session.status === 'playing') {
          setQuizData(session.questions || []);
          setQuizName(session.gameName);
          setStep('playing');
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [step, code]);

  // 3. LOGIKA ANTI-CHEAT (Poin 14)
  useEffect(() => {
    if (step !== 'playing') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setLives(prev => {
          const next = prev - 1;
          alert(`⚠️ PELANGGARAN: PINDAH TAB TERDETEKSI!\nNyawa berkurang! Sisa: ${next}`);
          if (next <= 0) finishGame();
          return next;
        });
      }
    };

    const preventAction = (e: any) => e.preventDefault();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", preventAction);
    document.addEventListener("contextmenu", preventAction);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("contextmenu", preventAction);
    };
  }, [step]);

  // 4. TIMER & AUTO-SAVE
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 'playing') {
      handleAnswer(-1); // Timeout
    }
    return () => clearInterval(timer);
  }, [timeLeft, step]);

  const handleAnswer = (selectedIdx: number) => {
    const isCorrect = selectedIdx === quizData[currentQIndex].correct;
    
    if (!isCorrect) {
      setIsWrongEffect(true);
      setTimeout(() => setIsWrongEffect(false), 500);
      setLives(prev => prev - 1);
    }

    const points = isCorrect ? (timeLeft * 10) + 100 : 0;
    const newTotalScore = score + points;
    setScore(newTotalScore);

    const newAnswer = { qIdx: currentQIndex, selectedIdx, isCorrect, timeTaken: 20 - timeLeft };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // UPDATE DATA KE HOST (Agar Leaderboard Live Update)
    const participants = JSON.parse(localStorage.getItem(`participants_${code}`) || '[]');
    const myIndex = participants.findIndex((p: any) => p.name === name);
    if (myIndex !== -1) {
      participants[myIndex].score = newTotalScore;
      participants[myIndex].correctAnswers = updatedAnswers.filter(a => a.isCorrect).length;
      localStorage.setItem(`participants_${code}`, JSON.stringify(participants));
    }

    if (currentQIndex < quizData.length - 1 && (isCorrect || lives > 1)) {
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(20);
    } else {
      finishGame();
    }
  };

  const finishGame = () => setStep('result');

  // --- UI: JOIN SCREEN ---
  if (step === 'join') return (
    <main className="min-h-screen bg-[#059669] flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[3rem] border-8 border-black shadow-[12px_12px_0_0_#000] w-full max-w-md text-center">
        <div className="text-6xl mb-4">🎒</div>
        <h1 className="text-4xl font-black italic mb-8 tracking-tighter uppercase leading-none">Bioscope <span className="text-emerald-600">Play</span></h1>
        <div className="space-y-4">
          <input 
            type="text" placeholder="KODE GAME" 
            className="w-full p-5 bg-slate-100 border-4 border-black rounded-2xl text-center text-2xl font-black outline-none focus:bg-yellow-50"
            value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <input 
            type="text" placeholder="NAMA KAMU" 
            className="w-full p-4 border-4 border-black rounded-2xl text-center font-bold outline-none"
            value={name} onChange={(e) => setName(e.target.value)}
          />
          <button 
            disabled={!code || !name}
            onClick={handleStartPlaying}
            className="w-full bg-[#FACC15] text-black py-5 rounded-2xl font-black text-xl border-4 border-black shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50"
          >
            MASUK KELAS 🚀
          </button>
        </div>
      </div>
    </main>
  );

  // --- UI: LOBBY SCREEN (Waiting for Host) ---
  if (step === 'lobby') return (
    <main className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="animate-bounce text-8xl mb-6">🛰️</div>
      <h2 className="text-4xl font-black uppercase italic mb-2">Berhasil Join!</h2>
      <p className="text-indigo-200 font-bold mb-8">Tunggu Gurumu Menekan Tombol <span className="text-yellow-400">MULAI</span> Ya...</p>
      <div className="bg-white/10 px-8 py-4 rounded-full border-2 border-white/20 animate-pulse">
        Siswa Terdaftar: <span className="font-black">{name}</span>
      </div>
    </main>
  );

  // --- UI: PLAYING SCREEN ---
  if (step === 'playing' && quizData.length > 0) return (
    <main className={`min-h-screen transition-colors duration-300 p-6 flex flex-col items-center ${isWrongEffect ? 'bg-red-500' : 'bg-slate-100'}`}>
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0_0_#000]">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase opacity-50">Health Points</span>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`w-3 h-5 rounded-sm border-2 border-black ${i < lives ? 'bg-red-500' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
        <div className="text-center font-black">
          <div className="text-xs uppercase opacity-40">{quizName}</div>
          <div className={`text-4xl ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-black'}`}>{timeLeft}s</div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase opacity-50">Score</span>
          <div className="text-2xl font-black text-indigo-600">{score}</div>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white border-4 border-black rounded-[3rem] p-10 shadow-[12px_12px_0_0_#000] mb-10">
        <h2 className="text-2xl font-black mb-12 text-center leading-tight">
          {quizData[currentQIndex]?.q}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizData[currentQIndex]?.options.map((opt, idx) => (
            <button 
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="p-6 bg-white border-4 border-black rounded-2xl font-black text-lg hover:bg-indigo-600 hover:text-white transition-all shadow-[4px_4px_0_0_#000] text-left"
            >
              <span className="mr-3 opacity-30">{String.fromCharCode(65 + idx)}.</span> {opt}
            </button>
          ))}
        </div>
      </div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">🛡️ Anti-Cheat System Active</div>
    </main>
  );

  // --- UI: RESULT SCREEN (Ibu sudah buat dengan bagus!) ---
  if (step === 'result') return (
    <main className="min-h-screen bg-indigo-600 text-white flex flex-col items-center justify-center p-6">
       <div className="bg-white text-black p-12 rounded-[4rem] border-8 border-black shadow-[20px_20px_0_0_#000] text-center max-w-md w-full">
         <div className="text-7xl mb-4">🏆</div>
         <h1 className="text-5xl font-black italic mb-2 uppercase">Selesai!</h1>
         <div className="bg-slate-100 p-8 rounded-3xl border-4 border-black my-8">
            <span className="text-xs font-black uppercase opacity-50">Skor Kamu</span>
            <div className="text-6xl font-black text-indigo-600">{score}</div>
         </div>
         <div className="grid grid-cols-1 gap-4">
            <button onClick={() => setStep('review')} className="py-4 bg-[#22C55E] text-white rounded-2xl border-4 border-black font-black text-xl">LIHAT JAWABAN 📖</button>
            <button onClick={() => router.push('/quiz')} className="py-4 bg-slate-200 text-black rounded-2xl border-4 border-black font-black text-xl">KELUAR 🏠</button>
         </div>
       </div>
    </main>
  );

  // --- UI: REVIEW MODE ---
  if (step === 'review') return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black italic uppercase">Review</h2>
          <button onClick={() => setStep('result')} className="bg-black text-white px-6 py-2 rounded-xl font-black uppercase text-xs">Kembali</button>
        </header>
        <div className="space-y-6">
          {quizData.map((q, idx) => {
            const studentAns = answers.find(a => a.qIdx === idx);
            return (
              <div key={idx} className={`bg-white p-6 rounded-3xl border-4 border-black shadow-[6px_6px_0_0_#000] ${studentAns?.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <p className="font-bold text-lg mb-4">{q.q}</p>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 border-2 border-green-500 rounded-xl text-sm">
                    <span className="font-black text-green-600 uppercase text-[9px]">Benar:</span> {q.options[q.correct]}
                  </div>
                  {!studentAns?.isCorrect && (
                    <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl text-sm">
                      <span className="font-black text-red-600 uppercase text-[9px]">Kamu:</span> {studentAns?.selectedIdx === -1 ? 'Waktu Habis' : q.options[studentAns?.selectedIdx]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );

  return null;
}

export default function StudentPlay() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayContent />
    </Suspense>
  );
}