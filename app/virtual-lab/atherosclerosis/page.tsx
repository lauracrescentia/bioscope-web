"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ArteriosclerosisVirtualLab() {
  const router = useRouter();
  
  // States untuk simulasi
  const [plakLevel, setPlakLevel] = useState(0); // 0% sampai 80% penyumbatan
  const [showFeedback, setShowFeedback] = useState(false);

  // Perhitungan Kecepatan Aliran Darah (Semakin sempit, semakin lambat/terhambat)
  // Namun secara fisika, di area sempit kecepatan meningkat (Ventral effect), 
  // tapi volume total yang lewat berkurang drastis.
  const flowSpeed = Math.max(0.2, 2 - (plakLevel / 50)); 
  const bloodCount = Math.max(2, 15 - (plakLevel / 7)); // Jumlah sel darah yang bisa lewat

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-[#0F172A]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0_0_#000]">
          <div>
            <h1 className="text-3xl font-black italic uppercase">Virtual Lab: Arteriosklerosis</h1>
            <p className="text-sm font-bold text-slate-500">Simulasi Aliran Darah & Plak Lemak</p>
          </div>
          <button onClick={() => router.back()} className="font-black underline uppercase hover:text-orange-600 transition-colors">Keluar</button>
        </div>

        {/* AREA SIMULASI (Point A & B) */}
        <div className="bg-white border-4 border-black rounded-[3rem] p-10 shadow-[12px_12px_0_0_#FB923C] relative overflow-hidden">
          <h2 className="font-black uppercase text-slate-400 mb-8">Penampang Pembuluh Darah (Arteri)</h2>

          {/* Animasi Pembuluh Darah */}
          <div className="relative h-48 bg-red-100 border-y-8 border-black flex items-center overflow-hidden">
            
            {/* Aliran Sel Darah */}
            <div className="flex gap-8 animate-flow w-full">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="w-8 h-8 bg-red-600 rounded-full shadow-inner flex-shrink-0"
                  style={{ 
                    animation: `bloodRun ${flowSpeed}s infinite linear`,
                    opacity: i < bloodCount ? 1 : 0 
                  }}
                ></div>
              ))}
            </div>

            {/* Plak Lemak Atas */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-yellow-400 border-b-4 border-x-4 border-black rounded-b-[3rem] transition-all duration-500"
              style={{ height: `${plakLevel / 2}%`, width: '40%' }}
            >
                {plakLevel > 40 && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-yellow-800 uppercase">PLAK</div>}
            </div>

            {/* Plak Lemak Bawah */}
            <div 
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-yellow-400 border-t-4 border-x-4 border-black rounded-t-[3rem] transition-all duration-500`}
              style={{ height: `${plakLevel / 2}%`, width: '40%' }}
            ></div>
          </div>

          {/* Slider Manipulasi (Point B) */}
          <div className="mt-12 max-w-xl mx-auto space-y-4 bg-slate-50 p-6 rounded-2xl border-2 border-black border-dashed">
            <div className="flex justify-between font-black uppercase text-xs">
              <span>Pembuluh Normal</span>
              <span className="text-orange-600">Penyumbatan Parah</span>
            </div>
            <input 
              type="range" min="0" max="85" step="5"
              className="w-full h-6 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 border-2 border-black"
              value={plakLevel}
              onChange={(e) => setPlakLevel(Number(e.target.value))}
            />
            <div className="text-center font-black text-2xl uppercase italic">
              Level Plak: {plakLevel}%
            </div>
            <button 
              onClick={() => setShowFeedback(true)}
              className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none"
            >
              Analisis Hasil 🔍
            </button>
          </div>
        </div>

        {/* FEEDBACK ILMIAH (Point C) */}
        {showFeedback && (
          <div className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[8px_8px_0_0_#000] animate-in fade-in zoom-in duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500 text-white p-3 rounded-2xl font-black text-2xl">!</div>
              <div>
                <h3 className="text-2xl font-black uppercase italic mb-2">Laporan Diagnosa 🧪</h3>
                <p className="font-bold leading-relaxed text-slate-700">
                  {plakLevel < 20 ? (
                    "Aliran darah sangat lancar. Dinding arteri elastis dan tidak ada hambatan berarti bagi sel darah merah untuk membawa oksigen ke seluruh tubuh."
                  ) : plakLevel < 50 ? (
                    "Terdeteksi adanya tumpukan LDL (kolesterol jahat). Aliran darah mulai menyempit, memaksa tekanan darah naik agar volume darah tetap tercukupi."
                  ) : (
                    "Kondisi Kritis! Plak telah menutup lebih dari setengah diameter arteri. Sel darah merah sulit lewat, risiko penggumpalan darah (trombosis) meningkat drastis yang dapat menyebabkan serangan jantung atau stroke."
                  )}
                </p>
                <button 
                   onClick={() => setShowFeedback(false)} 
                   className="mt-4 text-xs font-black uppercase underline"
                >Tutup Diagnosa</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bloodRun {
          from { transform: translateX(-100%); }
          to { transform: translateX(500%); }
        }
      `}</style>
    </main>
  );
}