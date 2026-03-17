"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LungCapacityLab() {
  const router = useRouter();
  const [isBlowing, setIsBlowing] = useState(false);
  const [volume, setVolume] = useState(0); 
  const [maxVolume, setMaxVolume] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const TARGET_VOLUME = 3800; 

  useEffect(() => {
    let interval: any;
    if (isBlowing && volume < TARGET_VOLUME) {
      interval = setInterval(() => {
        setVolume(prev => prev + Math.floor(Math.random() * 50) + 20);
      }, 50);
    } else if (volume >= TARGET_VOLUME) {
      setIsBlowing(false);
      setStatus('done');
      setMaxVolume(volume);
    }
    return () => clearInterval(interval);
  }, [isBlowing, volume]);

  const handleStart = () => {
    setVolume(0);
    setStatus('running');
    setShowFeedback(false);
    setAnswers({});
  };

  const resetLab = () => {
    setVolume(0);
    setMaxVolume(0);
    setStatus('idle');
    setIsBlowing(false);
    setShowFeedback(false);
    setAnswers({});
  };

  return (
    <main className="min-h-screen bg-white p-6 md:p-12 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10 border-b-4 border-black pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/virtual-lab')} 
              className="text-2xl p-3 bg-black text-white shadow-md rounded-xl hover:scale-110 transition border-2 border-black"
            >
              ⬅️
            </button>
            <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Uji Kapasitas Vital Paru 🫁</h1>
          </div>
          <button 
            onClick={resetLab} 
            className="px-6 py-2 bg-red-100 text-red-800 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-red-600 hover:bg-red-600 hover:text-white transition"
          >
            Reset Lab
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          {/* KIRI: VISUALISASI SPIROMETER */}
          <div className="bg-slate-50 p-10 rounded-[3.5rem] shadow-inner border-2 border-slate-300 flex flex-col items-center sticky top-10">
            <div className="w-40 h-80 bg-white rounded-t-full border-4 border-slate-400 relative flex flex-col-reverse overflow-hidden shadow-md">
              <div 
                className="w-full bg-sky-500 transition-all duration-300 relative"
                style={{ height: `${100 - (volume / 5000 * 100)}%` }}
              >
                <div className="absolute top-0 w-full h-2 bg-sky-600/30"></div>
              </div>
              <div 
                className="w-full bg-slate-50 transition-all duration-300 flex items-center justify-center overflow-hidden"
                style={{ height: `${(volume / 5000 * 100)}%` }}
              >
                {isBlowing && <div className="animate-bounce text-2xl">🫧</div>}
              </div>
            </div>

            <div className="w-4 h-16 bg-black -mt-1 rounded-b-full"></div>
            <div className="w-32 h-3 bg-black rounded-full -rotate-12 translate-x-12 shadow-md"></div>

            <div className="mt-8 bg-black p-6 rounded-3xl w-full text-center border-4 border-slate-700 shadow-2xl">
               <p className="text-xs font-black uppercase tracking-[0.2em] mb-1 text-slate-300">Volume Udara Terukur</p>
               <div className="flex items-baseline justify-center gap-2">
                  <p className="text-6xl font-black font-mono text-green-400">{volume}</p>
                  <p className="text-xl font-bold text-green-700">mL</p>
               </div>
            </div>
          </div>

          {/* KANAN: INSTRUKSI & KONTROL */}
          <div className="space-y-8">
            {status !== 'done' && (
              <div className="bg-white p-8 rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0_0_#000]">
                 <h3 className="font-black text-black mb-3 text-2xl uppercase underline decoration-blue-500">Cara Kerja:</h3>
                 <p className="text-lg text-black leading-relaxed font-bold">
                   1. Tarik napas sedalam mungkin (Inspirasi Maksimum).<br/>
                   2. Klik dan <span className="bg-yellow-300 px-2">TAHAN</span> tombol di bawah.<br/>
                   3. Keluarkan semua udara ke dalam botol sampai habis.
                 </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {status === 'idle' && (
                <button 
                  onClick={handleStart}
                  className="w-full bg-black text-white py-8 rounded-[2rem] font-black text-3xl shadow-[0_10px_0_#334155] active:translate-y-2 active:shadow-none transition-all border-2 border-black"
                >
                  MULAI PENGUJIAN
                </button>
              )}

              {status === 'running' && (
                <button 
                  onMouseDown={() => setIsBlowing(true)}
                  onMouseUp={() => setIsBlowing(false)}
                  onTouchStart={() => setIsBlowing(true)}
                  onTouchEnd={() => setIsBlowing(false)}
                  className={`w-full py-12 rounded-[2.5rem] font-black text-4xl transition-all shadow-2xl border-4 ${
                    isBlowing 
                    ? 'bg-green-600 text-white border-black animate-pulse' 
                    : 'bg-yellow-400 border-black text-black'
                  }`}
                >
                  {isBlowing ? 'SEDANG MENIUP...' : 'TEKAN & TAHAN'}
                </button>
              )}

              {status === 'done' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                  {/* HASIL DATA */}
                  <div className="bg-black p-8 rounded-[2.5rem] border-4 border-green-500 shadow-2xl">
                     <p className="text-center text-xs font-black text-white uppercase tracking-[0.3em] mb-3">Hasil Analisis Akhir</p>
                     <div className="bg-white p-4 rounded-2xl mb-6 text-center">
                        <h2 className="text-6xl font-black text-black">{maxVolume} <span className="text-2xl">mL</span></h2>
                     </div>
                     <div className="text-md text-white space-y-3 font-black uppercase tracking-tight">
                        <p className="flex justify-between border-b border-white/20 pb-2"><span>Kapasitas Vital:</span> <span className="text-green-400">{maxVolume} mL</span></p>
                        <p className="flex justify-between border-b border-white/20 pb-2"><span>Status:</span> <span className="text-sky-400">Normal</span></p>
                     </div>
                  </div>

                  {/* PERTANYAAN ANALISIS - BACKGROUND DIWARNAI (SLATE-100) */}
                  <div className="bg-slate-100 p-8 rounded-[2.5rem] border-4 border-black shadow-[10px_10px_0_0_#000]">
                    <h3 className="text-2xl font-black mb-6 text-black uppercase italic border-b-4 border-black inline-block">
                      Pertanyaan Analisis 🧠
                    </h3>
                    
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <p className="font-black text-black text-lg">1. Mengapa atlet renang memiliki kapasitas vital lebih besar?</p>
                        <select 
                          className="w-full p-4 rounded-xl border-4 border-black font-black bg-white text-black focus:ring-4 ring-blue-500/20 outline-none"
                          onChange={(e) => setAnswers({...answers, q1: e.target.value})}
                        >
                          <option value="">Pilih Jawaban...</option>
                          <option value="a">Karena sering menahan napas</option>
                          <option value="b">Latihan memperkuat otot pernapasan</option>
                          <option value="c">Karena paru-parunya mengecil</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <p className="font-black text-black text-lg">2. Apa efek pneumonia pada alveoli?</p>
                        <select 
                          className="w-full p-4 rounded-xl border-4 border-black font-black bg-white text-black focus:ring-4 ring-blue-500/20 outline-none"
                          onChange={(e) => setAnswers({...answers, q2: e.target.value})}
                        >
                          <option value="">Pilih Jawaban...</option>
                          <option value="a">Kapasitas vital menurun drastis</option>
                          <option value="b">Kapasitas vital tetap normal</option>
                          <option value="c">Paru-paru menjadi elastis</option>
                        </select>
                      </div>

                      <button 
                        onClick={() => setShowFeedback(true)}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-black transition-colors border-4 border-black shadow-[5px_5px_0_0_#000]"
                      >
                        CEK JAWABAN SEKARANG
                      </button>

                      {showFeedback && (
                        <div className="p-6 bg-yellow-100 border-4 border-black rounded-2xl text-black font-bold shadow-inner">
                          <p className="text-xl font-black mb-3 text-blue-800 uppercase underline">Penjelasan Ilmiah:</p>
                          <p className="mb-2">1. <span className="font-black underline">Jawaban (B):</span> Otot pernapasan yang kuat memungkinkan pengembangan paru yang lebih maksimal.</p>
                          <p>2. <span className="font-black underline">Jawaban (A):</span> Cairan di alveoli mengurangi ruang kosong untuk udara, sehingga kapasitas turun.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}