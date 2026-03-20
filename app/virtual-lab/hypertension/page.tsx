"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HypertensionVirtualLab() {
  const router = useRouter();
  
  // States untuk simulasi
  const [pressure, setPressure] = useState(120); // Sistolik
  const [heartRate, setHeartRate] = useState(70); // Detak jantung
  const [dataLog, setDataLog] = useState<{time: number, bp: number, hr: number}[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [time, setTime] = useState(0);

  // Animasi Jantung (Kecepatan detak berdasarkan pressure)
  const heartSpeed = Math.max(0.3, 1.5 - (pressure / 200)); 

  useEffect(() => {
    let interval: any;
    if (isSimulating && time < 20) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
        
        // Logika: Semakin tinggi tekanan, jantung dipaksa detak lebih cepat (heart rate naik)
        const newBP = pressure + Math.floor(Math.random() * 5);
        const newHR = heartRate + Math.floor((newBP - 120) / 10);
        
        setDataLog((prev) => [...prev, { time: time, bp: newBP, hr: newHR }]);
      }, 1000);
    } else if (time >= 20) {
      setIsSimulating(false);
    }
    return () => clearInterval(interval);
  }, [isSimulating, time, pressure, heartRate]);

  return (
    <main className="min-h-screen bg-[#F0F4F8] p-4 md:p-8 font-sans text-[#0F172A]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0_0_#000]">
          <div>
            <h1 className="text-3xl font-black italic uppercase">Virtual Lab: Hipertensi</h1>
            <p className="text-sm font-bold text-slate-500">Simulasi Beban Jantung & Tekanan Darah</p>
          </div>
          <button onClick={() => router.back()} className="font-black underline uppercase">Keluar</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* KIRI: Visualisasi Jantung (Point A) */}
          <div className="lg:col-span-5 bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-[8px_8px_0_0_#EF4444] flex flex-col items-center justify-center relative overflow-hidden">
            <h2 className="absolute top-6 left-8 font-black uppercase text-slate-400">Visualisasi Beban Kerja Jantung</h2>
            
            {/* Animasi Jantung */}
            <div 
              className="w-48 h-48 bg-red-500 rounded-full flex items-center justify-center shadow-inner mb-6 relative"
              style={{ animation: `pulse ${heartSpeed}s infinite ease-in-out` }}
            >
              <span className="text-7xl">❤️</span>
              {pressure > 140 && (
                <div className="absolute inset-0 border-8 border-red-300 rounded-full animate-ping opacity-50"></div>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-4xl font-black tracking-tighter">{pressure} <span className="text-lg uppercase text-slate-400">mmHg</span></p>
              <p className={`font-bold px-4 py-1 rounded-full border-2 border-black inline-block
                ${pressure > 140 ? 'bg-red-500 text-white' : 'bg-green-400 text-black'}`}>
                {pressure > 140 ? 'Beban Kerja: Tinggi' : 'Beban Kerja: Normal'}
              </p>
            </div>

            {/* Kontrol Tekanan */}
            <div className="w-full mt-10 space-y-4">
              <label className="block text-center font-black uppercase text-xs">Atur Tekanan Darah</label>
              <input 
                type="range" min="100" max="200" step="5"
                className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black border-2 border-black"
                value={pressure}
                onChange={(e) => {
                   setPressure(Number(e.target.value));
                   setTime(0);
                   setDataLog([]);
                }}
              />
              <button 
                onClick={() => { setIsSimulating(true); setTime(0); setDataLog([]); }}
                disabled={isSimulating}
                className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase italic shadow-[4px_4px_0_0_#EF4444] active:translate-y-1 transition-all"
              >
                {isSimulating ? 'Mensimulasi...' : 'Mulai Simulasi ⚡'}
              </button>
            </div>
          </div>

          {/* KANAN: Grafik Interaktif (Point B) */}
          <div className="lg:col-span-7 bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-[8px_8px_0_0_#6366F1]">
            <h2 className="font-black uppercase mb-6 border-b-4 border-black pb-2">Grafik Tekanan Darah Real-time</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataLog}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[80, 220]} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: '4px solid black'}} />
                  <Line type="monotone" dataKey="bp" stroke="#EF4444" strokeWidth={4} dot={false} />
                  <Line type="monotone" dataKey="hr" stroke="#6366F1" strokeWidth={4} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div> <span className="text-xs font-bold uppercase">Tekanan Darah</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-500 rounded"></div> <span className="text-xs font-bold uppercase">Detak Jantung</span></div>
            </div>
          </div>

        </div>

        {/* Feedback Ilmiah (Point C) */}
        {time >= 20 && (
          <div className="bg-yellow-300 border-4 border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0_0_#000] animate-bounce-short">
            <h3 className="text-2xl font-black uppercase italic mb-4">Kesimpulan Ilmiah 🧪</h3>
            <p className="font-bold leading-relaxed text-lg">
              Berdasarkan simulasi, saat tekanan darah naik ke <span className="bg-white px-2">{pressure} mmHg</span>, 
              otot jantung (miokardium) harus berkontraksi lebih kuat dan cepat untuk melawan resistensi pembuluh darah. 
              Jika kondisi ini berlangsung lama, jantung dapat mengalami hipertrofi (penebalan otot) yang justru melemahkan fungsinya, menyebabkan gagal jantung.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-bounce-short {
          animation: bounce 0.5s ease-in-out 1;
        }
      `}</style>
    </main>
  );
}