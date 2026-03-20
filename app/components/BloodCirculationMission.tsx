"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

type CirculationMode = "kecil" | "besar" | null;

export default function BloodCirculationMission({ onComplete }: Props) {
  const [mode, setMode] = useState<CirculationMode>(null);
  const [visited, setVisited] = useState<string[]>([]);

  // Path definisi untuk digunakan di SVG dan offsetPath
  const PATH_KECIL = "M 200 250 C 300 150, 100 150, 200 250";
  const PATH_BESAR = "M 200 250 C 350 400, 50 400, 200 250";

  const handleModeChange = (newMode: CirculationMode) => {
    setMode(newMode);
    if (newMode && !visited.includes(newMode)) {
      setVisited((prev) => [...prev, newMode]);
    }
  };

  const isFinished = visited.length >= 2;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center bg-white rounded-[3rem] shadow-xl border-8 border-slate-50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic">Misi 5: Jalur Sirkulasi</h2>
        <p className="text-slate-500 font-bold text-sm mt-2">Pilih mode untuk melihat aliran darah</p>
      </div>

      <div className="flex gap-4 mb-10">
        <button
          onClick={() => handleModeChange("kecil")}
          className={`px-6 py-3 rounded-2xl font-black transition-all shadow-lg ${
            mode === "kecil" ? "bg-blue-600 text-white scale-105" : "bg-slate-100 text-slate-400"
          }`}
        >
          Peredaran Kecil 🧊
        </button>
        <button
          onClick={() => handleModeChange("besar")}
          className={`px-6 py-3 rounded-2xl font-black transition-all shadow-lg ${
            mode === "besar" ? "bg-red-600 text-white scale-105" : "bg-slate-100 text-slate-400"
          }`}
        >
          Peredaran Besar 🔥
        </button>
      </div>

      {/* AREA DIAGRAM */}
      <div className="relative w-full max-w-md h-[500px] bg-slate-50 rounded-[3rem] border-4 border-slate-100 overflow-hidden shadow-inner">
        
        {/* PARU-PARU (Atas) */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <motion.div animate={{ opacity: mode === "besar" ? 0.2 : 1 }} className="text-5xl bg-cyan-100 p-4 rounded-3xl border-4 border-cyan-300">☁️</motion.div>
          <span className="text-[10px] font-black text-cyan-600 uppercase mt-2">Paru-Paru</span>
        </div>

        {/* JANTUNG (Tengah) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="text-6xl bg-white w-32 h-32 rounded-[2.5rem] shadow-2xl flex items-center justify-center border-8 border-red-50"
          >
            ❤️
          </motion.div>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-red-600 uppercase bg-white px-2 py-1 rounded-md shadow-sm">Jantung</span>
        </div>

        {/* TUBUH (Bawah) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <motion.div animate={{ opacity: mode === "kecil" ? 0.2 : 1 }} className="text-5xl bg-orange-100 p-4 rounded-3xl border-4 border-orange-300">🧍</motion.div>
          <span className="text-[10px] font-black text-orange-600 uppercase mt-2">Seluruh Tubuh</span>
        </div>

        {/* SVG ANIMATION LAYER */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500">
          {/* Jalur Kecil */}
          <path d={PATH_KECIL} fill="none" stroke={mode === "kecil" ? "#3b82f6" : "#e2e8f0"} strokeWidth="8" strokeLinecap="round" className="transition-colors duration-500" />
          
          {/* Jalur Besar */}
          <path d={PATH_BESAR} fill="none" stroke={mode === "besar" ? "#ef4444" : "#e2e8f0"} strokeWidth="8" strokeLinecap="round" className="transition-colors duration-500" />

          {/* Titik Darah Bergerak */}
          <AnimatePresence>
            {mode === "kecil" && (
              <motion.circle
                r="10"
                fill="#3b82f6"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                style={{ offsetPath: `path('${PATH_KECIL}')`, filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" }}
              />
            )}
            {mode === "besar" && (
              <motion.circle
                r="10"
                fill="#ef4444"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ offsetPath: `path('${PATH_BESAR}')`, filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))" }}
              />
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* FOOTER EXPLANATION */}
      <div className="mt-8 w-full max-w-md text-center h-24 flex items-center justify-center">
        {mode ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={mode} className={`p-4 rounded-2xl border-2 ${mode === 'kecil' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <p className="text-sm font-bold leading-snug">
              {mode === "kecil" 
                ? "Darah kotor dipompa ke paru-paru untuk mengambil oksigen, lalu kembali ke jantung."
                : "Darah bersih penuh oksigen disebarkan ke seluruh sel tubuh agar kita punya energi!"}
            </p>
          </motion.div>
        ) : <p className="text-slate-400 italic">Pilih peredaran darah untuk memulai animasi...</p>}
      </div>

      <div className="mt-6 h-12">
        {isFinished && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            onClick={onComplete}
            className="bg-green-500 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-green-600 transition-all uppercase"
          >
            Selesaikan Misi Akhir 🎓
          </motion.button>
        )}
      </div>
    </div>
  );
}