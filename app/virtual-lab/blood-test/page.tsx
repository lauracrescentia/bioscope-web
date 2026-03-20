"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BloodTestPage() {
  const router = useRouter();
  
  const [patientBloodType, setPatientBloodType] = useState<{type: string, rh: boolean}>({ type: 'A', rh: true });
  const [bloodResult, setBloodResult] = useState<{ [key: string]: boolean | null }>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const bloodTypes = ['A', 'B', 'AB', 'O'];
  
  useEffect(() => {
    generateRandomPatient();
  }, []);

  const generateRandomPatient = () => {
    const randomType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
    const randomRh = Math.random() > 0.3;
    setPatientBloodType({ type: randomType, rh: randomRh });
    setBloodResult({});
    setShowFeedback(false);
  };

  const reagents = [
    { id: 'Anti-A', color: 'bg-yellow-400', label: 'Anti-A' },
    { id: 'Anti-B', color: 'bg-blue-400', label: 'Anti-B' },
    { id: 'Anti-AB', color: 'bg-white', label: 'Anti-AB' },
    { id: 'Anti-Rh', color: 'bg-purple-400', label: 'Anti-Rh' },
  ];

  const handleTest = (reagentId: string) => {
    let isAglutinasi = false;
    if (reagentId === 'Anti-A') isAglutinasi = patientBloodType.type === 'A' || patientBloodType.type === 'AB';
    if (reagentId === 'Anti-B') isAglutinasi = patientBloodType.type === 'B' || patientBloodType.type === 'AB';
    if (reagentId === 'Anti-AB') isAglutinasi = patientBloodType.type !== 'O';
    if (reagentId === 'Anti-Rh') isAglutinasi = patientBloodType.rh === true;
    
    const newResults = { ...bloodResult, [reagentId]: isAglutinasi };
    setBloodResult(newResults);
    if (Object.keys(newResults).length >= 4) setShowFeedback(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-bold uppercase tracking-tighter">
            <span>←</span> Kembali
          </button>
          <h1 className="text-xl md:text-3xl font-black tracking-tighter italic uppercase text-red-600">Virtual Lab: Blood Analysis</h1>
          <button onClick={generateRandomPatient} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-xs font-black transition-all border-b-4 border-red-900">
            GANTI PASIEN 👤
          </button>
        </div>

        {/* Instruksi */}
        <div className="mb-8 bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl shadow-xl">
          <p className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mb-2">Misi Laboratorium</p>
          <p className="text-slate-300 font-medium">Teteskan reagen ke cawan sampel. Amati: jika darah <span className="text-white font-bold underline italic">pecah menjadi bintik-bintik</span>, berarti terjadi <span className="text-red-500 font-bold underline">Aglutinasi</span>.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rak Reagen - Bersih tanpa teks raksasa */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl">
            <h3 className="text-xs font-black text-slate-500 uppercase mb-10 tracking-widest text-center border-b border-slate-800 pb-4">🧪 Rak Botol Reagen</h3>
            <div className="flex justify-around items-end h-32">
              {reagents.map((r) => (
                <button 
                  key={r.id} 
                  onClick={() => handleTest(r.id)}
                  disabled={bloodResult[r.id] !== undefined}
                  className={`group flex flex-col items-center gap-3 transition-all ${bloodResult[r.id] !== undefined ? 'opacity-20 scale-90 grayscale' : 'hover:-translate-y-4'}`}
                >
                  <div className={`w-10 h-20 ${r.color} rounded-t-xl rounded-b-md border-2 border-white/40 shadow-lg relative`}>
                    <div className="absolute top-2 w-full h-2 bg-white/20"></div>
                  </div>
                  <span className="text-[11px] font-black uppercase bg-slate-800 px-2 py-1 rounded">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cawan Sampel - Sekarang selalu merah sejak awal */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl">
            <h3 className="text-xs font-black text-slate-500 uppercase mb-8 tracking-widest text-center border-b border-slate-800 pb-4">🧫 Cawan Pengamatan</h3>
            <div className="grid grid-cols-2 gap-6">
              {reagents.map((r) => (
                <div key={r.id} className="bg-slate-950 p-4 rounded-3xl border-2 border-slate-800 flex flex-col items-center transition-all shadow-inner">
                  {/* Visual Darah: Default Merah */}
                  <div className="w-16 h-16 rounded-full bg-red-600 mb-3 border-4 border-slate-800 relative flex items-center justify-center overflow-hidden">
                    {/* State: Menggumpal (Titik-titik) */}
                    {bloodResult[r.id] === true && (
                      <div className="absolute inset-0 bg-red-800 flex flex-wrap gap-1 p-2 animate-in fade-in duration-500">
                        {[...Array(20)].map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 bg-red-950 rounded-full shadow-sm"></div>
                        ))}
                      </div>
                    )}
                    {/* State: Tidak Menggumpal (Tetap Mulus) */}
                    {bloodResult[r.id] === false && (
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 animate-in fade-in duration-500"></div>
                    )}
                    {/* State: Awal (Merah Darah Standar) */}
                    {bloodResult[r.id] === undefined && (
                      <div className="absolute inset-0 bg-red-600 opacity-80"></div>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-slate-600 mb-1">{r.label}</span>
                  <p className={`text-[10px] font-black uppercase tracking-tighter ${bloodResult[r.id] === true ? 'text-red-500' : bloodResult[r.id] === false ? 'text-green-500' : 'text-slate-700'}`}>
                    {bloodResult[r.id] === undefined ? "Menunggu..." : bloodResult[r.id] ? "Aglutinasi" : "Normal"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Akhir */}
        {showFeedback && (
          <div className="mt-10 bg-red-600/10 border-4 border-red-500/30 p-8 rounded-[3rem] animate-in slide-in-from-bottom-10 shadow-2xl">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-red-500 italic uppercase">🔬 Hasil Analisis Darah</h3>
            <div className="bg-slate-950/90 p-6 rounded-2xl border border-red-500/20 mb-6">
              <p className="text-slate-300 text-lg">
                Berdasarkan pengamatan, pasien memiliki Golongan Darah:
                <span className="block text-white font-black text-4xl mt-2 tracking-tighter">
                   {patientBloodType.type} {patientBloodType.rh ? 'RH POSITIF (+)' : 'RH NEGATIF (-)'}
                </span>
              </p>
            </div>
            
            <div className="flex gap-4">
              <button onClick={generateRandomPatient} className="flex-1 bg-slate-800 py-5 rounded-2xl font-black text-lg hover:bg-slate-700 transition-all border-b-8 border-black">
                UJI PASIEN LAIN 🔄
              </button>
              <button onClick={() => router.push('/virtual-lab')} className="flex-1 bg-red-600 py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all border-b-8 border-red-900 shadow-xl">
                SELESAI 🏁
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}