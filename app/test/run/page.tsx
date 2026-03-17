"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentRunTest() {
  const router = useRouter();
  const [step, setStep] = useState<'join' | 'waiting' | 'testing' | 'review'>('join');
  const [testData, setTestData] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any>({}); 
  const [timeLeft, setTimeLeft] = useState(0); 
  const [studentName, setStudentName] = useState('');

  // 1. MONITOR TOMBOL START GURU (SINKRONISASI)
  useEffect(() => {
    if (step === 'waiting' && testData) {
      const checkStatus = setInterval(() => {
        const status = localStorage.getItem(`live_status_${testData.id}`);
        if (status === 'STARTED') {
          setStep('testing');
          clearInterval(checkStatus);
        }
      }, 1000); // Cek setiap detik untuk respon cepat
      return () => clearInterval(checkStatus);
    }
  }, [step, testData]);

  // 2. ANTI-CHEAT & ANTI-AI
  useEffect(() => {
    if (step === 'testing') {
      const handleViolation = () => {
        alert("🚨 ANTI-CHEAT: Jangan tinggalkan halaman ujian atau nilai Anda akan dilaporkan!");
      };
      
      // Deteksi Pindah Tab/Aplikasi
      window.addEventListener("blur", handleViolation);
      // Blokir Klik Kanan (Anti-AI Copy-Paste)
      const blockContext = (e: MouseEvent) => e.preventDefault();
      document.addEventListener("contextmenu", blockContext);

      return () => {
        window.removeEventListener("blur", handleViolation);
        document.removeEventListener("contextmenu", blockContext);
      };
    }
  }, [step]);

  // 3. TIMER LOGIC (AUTO-SAVE)
  useEffect(() => {
    if (step === 'testing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (step === 'testing' && timeLeft === 0) {
      submitTest(); 
    }
  }, [timeLeft, step]);

  // 4. LOGIKA JOIN
  const handleJoin = (code: string) => {
    if (!studentName) return alert("Please enter your name first!");
    const library = JSON.parse(localStorage.getItem('test_library') || '[]');
    const found = library.find((t: any) => t.id === code.toUpperCase());
    
    if (found) {
      setTestData(found);
      setTimeLeft(found.duration * 60);
      localStorage.setItem('current_student', studentName);
      setStep('waiting');
    } else {
      alert("Test Code not found!");
    }
  };

  const handleAnswer = (qId: number, optIdx: number, type: string) => {
    const currentAnswers = answers[qId] || [];
    let newAnswers;

    if (type === 'multiple') {
      newAnswers = currentAnswers.includes(optIdx) 
        ? currentAnswers.filter((a: any) => a !== optIdx)
        : [...currentAnswers, optIdx];
    } else {
      newAnswers = [optIdx];
    }
    setAnswers({ ...answers, [qId]: newAnswers });
  };

  const submitTest = () => {
    // Simpan ke Reports
    const report = {
      testId: testData.id,
      testName: testData.name,
      studentName: studentName,
      answers: answers,
      timestamp: new Date().toLocaleString()
    };
    const allReports = JSON.parse(localStorage.getItem('test_reports') || '[]');
    localStorage.setItem('test_reports', JSON.stringify([...allReports, report]));
    setStep('review');
  };

  // --- VIEW 1: JOIN ---
  if (step === 'join') {
    return (
      <main className="min-h-screen bg-sky-600 flex items-center justify-center p-6 text-black">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center">
          <h1 className="text-3xl font-black mb-6 tracking-tighter text-sky-600 italic">BIOscope Test</h1>
          <input 
            type="text" placeholder="Your Full Name" 
            className="w-full p-4 bg-slate-100 rounded-2xl text-center font-bold mb-4 outline-none focus:ring-2 ring-sky-400"
            value={studentName} onChange={(e) => setStudentName(e.target.value)}
          />
          <input 
            type="text" placeholder="ENTER TEST CODE" 
            className="w-full p-4 bg-slate-800 text-white rounded-2xl text-center text-2xl font-mono font-black uppercase mb-6 outline-none"
            onKeyDown={(e: any) => e.key === 'Enter' && handleJoin(e.target.value)}
          />
          <p className="text-slate-400 text-xs italic">Press Enter to Join Room</p>
        </div>
      </main>
    );
  }

  // --- VIEW 2: WAITING ROOM ---
  if (step === 'waiting') {
    return (
      <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-20 h-20 border-8 border-sky-500 border-t-transparent rounded-full animate-spin mb-8"></div>
        <h1 className="text-4xl font-black mb-4 tracking-tight">You're in the Room! 🛋️</h1>
        <p className="text-slate-400 text-lg mb-10 max-w-md">
          Ujian <span className="text-sky-400 font-bold">{testData.name}</span> akan segera dimulai.<br/>
          Jangan tutup halaman ini.
        </p>
        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 w-full max-w-sm backdrop-blur-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Student Joined</p>
          <p className="text-2xl font-bold text-white">{studentName}</p>
          <div className="mt-6 py-2 px-6 bg-green-500/20 text-green-400 rounded-xl text-sm font-bold border border-green-500/30 inline-block animate-pulse">
            Ready to Start
          </div>
        </div>
      </main>
    );
  }

  // --- VIEW 3: TESTING ---
  if (step === 'testing') {
    const q = testData.questions[currentIdx];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
      <main className="min-h-screen bg-slate-50 text-black p-4 flex flex-col">
        {/* Header Siswa */}
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center bg-white p-5 rounded-[2rem] shadow-sm mb-6">
          <div className="font-black text-slate-400">Question {currentIdx + 1} of {testData.questions.length}</div>
          <div className={`px-6 py-2 rounded-2xl font-mono font-black text-2xl ${timeLeft < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-white'}`}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <button onClick={() => confirm("Finish test now?") && submitTest()} className="bg-green-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg">FINISH</button>
        </div>

        {/* Question Area */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 mb-8">
            <h2 className="text-2xl font-black mb-8 leading-tight">{q.text}</h2>
            {q.media && (
              <div className="mb-8 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner">
                <img src={q.media} className="w-full max-h-[400px] object-contain bg-slate-50" />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => handleAnswer(q.id, idx, q.type)}
                  className={`p-6 rounded-3xl font-bold text-left transition-all border-2 flex items-center gap-4 ${answers[q.id]?.includes(idx) ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-md scale-[1.02]' : 'border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${answers[q.id]?.includes(idx) ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {q.type === 'true-false' ? (idx === 0 ? 'T' : 'F') : (idx + 1)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center px-4">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(currentIdx - 1)}
              className="px-10 py-4 bg-white rounded-2xl font-black shadow-md disabled:opacity-20 transition hover:bg-slate-50"
            >← BACK</button>
            <button 
              disabled={currentIdx === testData.questions.length - 1}
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="px-10 py-4 bg-sky-500 text-white rounded-2xl font-black shadow-md disabled:opacity-20 transition hover:bg-sky-600"
            >NEXT →</button>
          </div>
        </div>
      </main>
    );
  }

  // --- VIEW 4: REVIEW ---
  return (
    <main className="min-h-screen bg-green-500 text-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-5xl font-black mb-2 tracking-tighter italic">TEST COMPLETED</h1>
        <p className="text-xl opacity-80">Jawaban Anda sudah masuk ke sistem.</p>
      </div>
      
      <div className="bg-white p-8 rounded-[3rem] text-black w-full max-w-2xl shadow-2xl">
        <h3 className="font-black text-center mb-8 text-slate-400 uppercase tracking-widest">Answer Review</h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
          {testData.questions.map((q: any, i: number) => {
            const isCorrect = JSON.stringify(answers[q.id]?.sort()) === JSON.stringify(q.correctAnswers.sort());
            return (
              <div key={i} className={`p-5 rounded-[2rem] border-2 ${isCorrect ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                <p className="font-bold mb-2 flex gap-2">
                  <span>{i+1}.</span> 
                  <span>{q.text}</span>
                  <span className="ml-auto">{isCorrect ? '✅' : '❌'}</span>
                </p>
                <div className="text-xs space-y-1">
                  <p className="text-slate-500 italic">Your Answer: {answers[q.id]?.map((a: number) => q.options[a]).join(', ') || 'Empty'}</p>
                  <p className="text-green-600 font-bold font-mono">Correct: {q.correctAnswers.map((a: number) => q.options[a]).join(', ')}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button 
          onClick={() => router.push('/dashboard')}
          className="w-full mt-8 py-5 bg-black text-white rounded-[2rem] font-black text-xl hover:bg-slate-800 transition"
        >
          FINISH & EXIT
        </button>
      </div>
    </main>
  );
}