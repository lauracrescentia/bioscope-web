"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function HeartRateLab() {
  const router = useRouter();
  
  const [bpm, setBpm] = useState(70);
  const [isRunning, setIsRunning] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const xPosRef = useRef(0);

  // --- LOGIKA PERUBAHAN BPM ---
  // Dibuat lebih responsif agar perubahan angka terasa natural
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setBpm(prev => Math.min(prev + 4, 160));
      }, 1500);
    } else {
      interval = setInterval(() => {
        setBpm(prev => Math.max(prev - 2, 70));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // --- LOGIKA GRAFIK EKG ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Efek trail yang halus
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      // Warna garis mengikuti status tombol
      ctx.strokeStyle = isRunning ? '#22c55e' : '#3b82f6'; 
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = isRunning ? '#22c55e' : '#3b82f6';

      const middle = canvas.height / 2;
      const x = xPosRef.current % canvas.width;
      
      // Kecepatan gelombang berdasarkan BPM
      const cycle = 6000 / bpm; 
      const step = xPosRef.current % cycle;
      let y = middle;

      // Gelombang PQRST
      if (step > 10 && step < 20) y -= 8; 
      else if (step >= 20 && step < 25) y += 5; 
      else if (step >= 25 && step < 35) y -= 45; // Puncak R
      else if (step >= 35 && step < 40) y += 15; 
      else if (step >= 50 && step < 75) y -= 10; // Gelombang T

      ctx.moveTo(x, middle);
      ctx.lineTo(x + 2, y);
      ctx.stroke();

      // Reset garis saat mencapai ujung kanan
      if (x > canvas.width - 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      xPosRef.current += 2;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current!);
  }, [bpm, isRunning]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <button onClick={() => router.back()} className="font-black text-slate-500 hover:text-white transition-all tracking-tighter uppercase italic">
            ← Exit Lab
          </button>
          <h1 className="text-xl md:text-3xl font-black italic uppercase text-white tracking-tighter">
            Activity <span className={isRunning ? 'text-green-500' : 'text-blue-500'}>&</span> Heart Rate
          </h1>
          <div className={`text-xs font-mono animate-pulse uppercase tracking-widest ${isRunning ? 'text-green-500' : 'text-blue-500'}`}>
            ● Monitoring System
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Sisi Kiri: Animasi Karakter & Tombol */}
          <div className="bg-slate-900 rounded-[3rem] border-4 border-slate-800 p-10 flex flex-col items-center shadow-2xl relative overflow-hidden">
            <div className="relative mb-10">
               <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/40 rounded-full blur-md transition-all ${isRunning ? 'animate-pulse scale-150' : ''}`}></div>
               <div className="text-9xl relative z-10 animate-bounce" style={{ animationDuration: isRunning ? '0.4s' : '1.5s' }}>
                 {isRunning ? '🏃‍♂️' : '🚶‍♂️'}
               </div>
            </div>
            
            <div className="w-full space-y-4">
              <button 
                onClick={() => {setIsRunning(true); setShowFeedback(true);}}
                className={`w-full py-6 rounded-3xl font-black text-xl border-b-[10px] active:border-b-0 active:translate-y-2 transition-all ${isRunning ? 'bg-slate-800 border-slate-950 text-slate-600 cursor-not-allowed shadow-none' : 'bg-green-500 border-green-800 text-white hover:bg-green-400 shadow-[0_0_25px_rgba(34,197,94,0.3)]'}`}
                disabled={isRunning}
              >
                START RUNNING 🔥
              </button>
              
              <button 
                onClick={() => setIsRunning(false)}
                className={`w-full py-6 rounded-3xl font-black text-xl border-b-[10px] active:border-b-0 active:translate-y-2 transition-all ${!isRunning ? 'bg-slate-800 border-slate-950 text-slate-600 cursor-not-allowed shadow-none' : 'bg-blue-600 border-blue-900 text-white hover:bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.3)]'}`}
                disabled={!isRunning}
              >
                STOP & REST 🧊
              </button>
            </div>
          </div>

          {/* Sisi Kanan: Monitor ECG */}
          <div className={`bg-slate-900 rounded-[3rem] border-4 border-slate-800 p-8 shadow-2xl flex flex-col transition-all duration-500 ${isRunning ? 'border-t-green-500 shadow-green-900/10' : 'border-t-blue-500 shadow-blue-900/10'}`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Physiological Data</h3>
                <div className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase transition-all ${isRunning ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-blue-500/10 border-blue-500 text-blue-500'}`}>
                  {isRunning ? 'Active Mode' : 'Recovery Mode'}
                </div>
            </div>
            
            <div className="flex-1 bg-black rounded-[2rem] border-4 border-slate-800 p-4 mb-6 flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <canvas ref={canvasRef} width={400} height={120} className="w-full relative z-10" />
              <div className="mt-6 flex items-baseline gap-2 relative z-10">
                <span className={`text-7xl font-black italic tracking-tighter transition-colors ${isRunning ? 'text-green-400' : 'text-blue-400'}`}>
                  {bpm}
                </span>
                <span className="font-black text-slate-600 italic uppercase">BPM</span>
              </div>
              <div className={`absolute top-6 right-8 text-3xl ${isRunning ? 'animate-ping' : 'animate-pulse'}`} style={{ animationDuration: `${60/bpm}s` }}>
                {isRunning ? '⚡' : '💤'}
              </div>
            </div>

            <div className="bg-black/50 p-5 rounded-2xl border-2 border-slate-800">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Analisis Aktivitas:</h4>
               {isRunning ? (
                 <p className="text-xs font-bold text-green-400 leading-tight">
                   Kenaikan BPM: Otot sedang bekerja keras dan memerlukan Oksigen (O<sub>2</sub>) lebih banyak. Jantung memompa lebih cepat untuk memenuhi kebutuhan tersebut.
                 </p>
               ) : (
                 <p className="text-xs font-bold text-blue-400 leading-tight">
                   Penurunan BPM: Tubuh sedang dalam fase pemulihan (Resting). Kebutuhan energi menurun, sehingga jantung melambat untuk menghemat energi.
                 </p>
               )}
            </div>
          </div>
        </div>

        {/* Info Panel Detail (Feedback) */}
        {showFeedback && (
          <div className="mt-10 bg-slate-900 border-4 border-slate-800 p-8 rounded-[3rem] shadow-2xl animate-in fade-in slide-in-from-bottom-5 transition-all">
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-colors ${isRunning ? 'bg-green-600 shadow-green-600/20' : 'bg-blue-600 shadow-blue-600/20'}`}>🔬</div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Kesimpulan Ilmiah</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 text-slate-400 font-medium text-sm leading-relaxed">
                <p>
                  <strong>1. Saat Berlari:</strong> Sistem saraf simpatis aktif. Jantung meningkatkan frekuensi detaknya agar O<sub>2</sub> terdistribusi cepat ke seluruh sel otot untuk respirasi sel.
                </p>
                <p>
                  <strong>2. Saat Berhenti:</strong> Sistem saraf parasimpatis mengambil alih untuk menjaga Homeostasis (keseimbangan tubuh) dengan menurunkan frekuensi detak jantung.
                </p>
              </div>
              <div className="bg-black/40 p-5 rounded-3xl border border-slate-800">
                <p className="text-xs text-slate-500 font-bold uppercase mb-2">Monitor Indikator:</p>
                <ul className="text-xs text-slate-300 space-y-2 italic font-bold uppercase">
                  <li>• BPM Naik = Suplai O<sub>2</sub> Meningkat</li>
                  <li>• BPM Turun = Fase Pemulihan</li>
                  <li>• Homeostasis = Kondisi Normal 70-80 BPM</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}