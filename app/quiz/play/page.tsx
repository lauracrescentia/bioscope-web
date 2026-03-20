"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentPlay() {
  const router = useRouter();
  
  // Game States
  const [step, setStep] = useState<'join' | 'lobby' | 'playing' | 'result' | 'review'>('join');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [lives, setLives] = useState(10);
  const [score, setScore] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isWrongEffect, setIsWrongEffect] = useState(false); // Efek layar merah jika salah

  // Data Dummy (Bisa diganti dengan fetch dari localStorage/API)
  const [quizData] = useState([
    { 
      id: 1, 
      q: "Berapakah hasil dari 2x + 5 = 15?", 
      options: ["5", "10", "15", "20"], 
      correct: 0,
    },
    { 
      id: 2, 
      q: "Manakah yang merupakan organ ekskresi utama manusia?", 
      options: ["Jantung", "Ginjal", "Lambung", "Otak"], 
      correct: 1,
    }
  ]);

  // --- LOGIKA ANTI-CHEAT (POIN 14) ---
  useEffect(() => {
    if (step !== 'playing') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation("PINDAH TAB TERDETEKSI!");
      }
    };

    const triggerViolation = (msg: string) => {
      setLives(prev => {
        const next = prev - 1;
        alert(`⚠️ PELANGGARAN: ${msg}\nNyawa berkurang! Sisa: ${next}`);
        if (next <= 0) finishGame();
        return next;
      });
    };

    const preventAction = (e: any) => e.preventDefault();

    // Event Listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", preventAction);
    document.addEventListener("contextmenu", preventAction);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("contextmenu", preventAction);
    };
  }, [step]);

  // --- TIMER & AUTO-SAVE (POIN 16 & 17) ---
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
    
    // Feedback Visual
    if (!isCorrect) {
      setIsWrongEffect(true);
      setTimeout(() => setIsWrongEffect(false), 500);
      setLives(prev => prev - 1);
    }

    // Auto Save Answer
    const newAnswer = { 
      qIdx: currentQIndex, 
      selectedIdx, 
      isCorrect,
      timeTaken: 20 - timeLeft 
    };
    setAnswers(prev => [...prev, newAnswer]);

    if (isCorrect) setScore(prev => prev + (timeLeft * 10)); // Skor berdasarkan kecepatan

    // Navigasi Soal
    if (currentQIndex < quizData.length - 1 && (isCorrect || lives > 1)) {
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(20);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setStep('result');
  };

  // --- UI: JOIN SCREEN ---
  if (step === 'join') return (
    <main className="min-h-screen bg-[#059669] flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[3rem] border-8 border-black shadow-[12px_12px_0_0_#000] w-full max-w-md text-center">
        <div className="text-6xl mb-4">🎒</div>
        <h1 className="text-4xl font-black italic mb-8 tracking-tighter uppercase">Student Join</h1>
        <div className="space-y-4">
          <input 
            type="text" placeholder="KODE GAME" 
            className="w-full p-5 bg-slate-100 border-4 border-black rounded-2xl text-center text-2xl font-black outline-none focus:bg-yellow-50"
            value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <input 
            type="text" placeholder="NAMA KAMU" 
            className="w-full p-4 border-4 border-black rounded-2xl text-center font-bold outline-none focus:border-[#059669]"
            value={name} onChange={(e) => setName(e.target.value)}
          />
          <button 
            disabled={!code || !name}
            onClick={() => setStep('playing')}
            className="w-full bg-[#FACC15] text-black py-5 rounded-2xl font-black text-xl border-4 border-black shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50"
          >
            MULAI BERMAIN 🚀
          </button>
        </div>
      </div>
    </main>
  );

  // --- UI: PLAYING SCREEN ---
  if (step === 'playing') return (
    <main className={`min-h-screen transition-colors duration-300 p-6 flex flex-col items-center ${isWrongEffect ? 'bg-red-500' : 'bg-slate-100'}`}>
      {/* HUD */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0_0_#000]">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase opacity-50">Health Points</span>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`w-4 h-6 rounded-sm border-2 border-black ${i < lives ? 'bg-red-500' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase opacity-50">Timer</span>
          <div className={`text-4xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-black'}`}>
            {timeLeft}s
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-black uppercase opacity-50">Total Score</span>
          <div className="text-2xl font-black text-indigo-600">{score.toLocaleString()}</div>
        </div>
      </div>

      {/* QUESTION */}
      <div className="w-full max-w-3xl bg-white border-4 border-black rounded-[3rem] p-10 shadow-[12px_12px_0_0_#000] mb-10">
        <div className="mb-8 flex justify-between items-center border-b-4 border-dotted border-slate-200 pb-4">
            <span className="font-black text-slate-400">PERTANYAAN {currentQIndex + 1}/{quizData.length}</span>
            <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-xs font-black uppercase">Biology Mode</span>
        </div>
        <h2 className="text-3xl font-black mb-12 text-center leading-tight">
          {quizData[currentQIndex].q}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizData[currentQIndex].options.map((opt, idx) => (
            <button 
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="group relative p-6 bg-white border-4 border-black rounded-2xl font-black text-xl hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none text-left"
            >
              <span className="inline-block w-8 h-8 border-2 border-current rounded-lg mr-4 text-center leading-7 group-hover:border-white">
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest bg-white/50 px-6 py-2 rounded-full border-2 border-slate-200">
        <span className="animate-pulse">🛡️</span> Anti-Cheat System Active
      </div>
    </main>
  );

  // --- UI: RESULT SCREEN ---
  if (step === 'result') return (
    <main className="min-h-screen bg-indigo-600 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-white text-black p-12 rounded-[4rem] border-8 border-black shadow-[20px_20px_0_0_#000] text-center max-w-md w-full animate-in zoom-in duration-500">
        <div className="text-7xl mb-4">🏆</div>
        <h1 className="text-5xl font-black italic mb-2 tracking-tighter uppercase">Selesai!</h1>
        <p className="font-bold text-slate-500 mb-8 uppercase tracking-widest">{name}</p>
        
        <div className="bg-slate-100 p-8 rounded-3xl border-4 border-black mb-10">
            <span className="text-xs font-black uppercase opacity-50">Skor Akhir Kamu</span>
            <div className="text-6xl font-black text-indigo-600">{score}</div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => setStep('review')}
            className="py-4 bg-[#22C55E] text-white rounded-2xl border-4 border-black font-black text-xl shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-all"
          >
            LIHAT JAWABAN 📖
          </button>
          <button 
            onClick={() => router.push('/')}
            className="py-4 bg-slate-200 text-black rounded-2xl border-4 border-black font-black text-xl"
          >
            KELUAR 🏠
          </button>
        </div>
      </div>
    </main>
  );

  // --- UI: REVIEW MODE ---
  if (step === 'review') return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Review Jawaban</h2>
            <button onClick={() => setStep('result')} className="bg-black text-white px-6 py-2 rounded-xl font-black uppercase text-xs">Kembali</button>
        </div>
        
        <div className="space-y-6">
            {quizData.map((q, idx) => {
              const studentAns = answers.find(a => a.qIdx === idx);
              return (
                <div key={idx} className={`bg-white p-8 rounded-[2.5rem] border-4 border-black shadow-[6px_6px_0_0_#000] ${studentAns?.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-black px-3 py-1 bg-slate-100 rounded-full uppercase">Soal {idx + 1}</span>
                        {studentAns?.isCorrect ? 
                            <span className="text-green-500 font-black italic">BENAR +100</span> : 
                            <span className="text-red-500 font-black italic">SALAH</span>
                        }
                    </div>
                    <p className="font-bold text-xl mb-6">{q.q}</p>
                    <div className="space-y-3">
                        <div className="p-4 bg-green-50 border-2 border-green-500 rounded-xl">
                            <span className="text-[10px] font-black uppercase text-green-600 block">Jawaban Benar:</span>
                            <span className="font-bold">{q.options[q.correct]}</span>
                        </div>
                        {!studentAns?.isCorrect && (
                            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl">
                                <span className="text-[10px] font-black uppercase text-red-600 block">Jawaban Kamu:</span>
                                <span className="font-bold">{studentAns?.selectedIdx === -1 ? 'WAKTU HABIS' : q.options[studentAns?.selectedIdx]}</span>
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