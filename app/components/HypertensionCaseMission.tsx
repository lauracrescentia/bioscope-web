"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Activity, User, Utensils, Zap } from "lucide-react";

interface Props {
  onComplete: () => void;
  onWrong?: () => void;
}

const CAUSES_OPTIONS = [
  { id: "c1", label: "Konsumsi garam tinggi", isCorrect: true },
  { id: "c2", label: "Kurang olahraga", isCorrect: true },
  { id: "c3", label: "Faktor genetik (Keluarga)", isCorrect: true },
  { id: "c4", label: "Kekurangan vitamin C", isCorrect: false },
];

const SOLUTIONS_OPTIONS = [
  { id: "s1", label: "Mengurangi konsumsi garam", isCorrect: true },
  { id: "s2", label: "Rutin olahraga 30 menit/hari", isCorrect: true },
  { id: "s3", label: "Menambah konsumsi gula", isCorrect: false },
  { id: "s4", label: "Istirahat cukup (7-8 jam)", isCorrect: true },
];

export default function HypertensionCaseMission({ onComplete, onWrong }: Props) {
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const toggleSelection = (id: string, type: "cause" | "solution") => {
    if (showResult && isCorrect) return; 
    const setter = type === "cause" ? setSelectedCauses : setSelectedSolutions;
    setter((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCheck = () => {
    const correctCauses = CAUSES_OPTIONS.filter((o) => o.isCorrect).map((o) => o.id);
    const correctSolutions = SOLUTIONS_OPTIONS.filter((o) => o.isCorrect).map((o) => o.id);

    const isCausesValid =
      selectedCauses.length === correctCauses.length &&
      selectedCauses.every((id) => correctCauses.includes(id));

    const isSolutionsValid =
      selectedSolutions.length === correctSolutions.length &&
      selectedSolutions.every((id) => correctSolutions.includes(id));

    setShowResult(true);

    if (isCausesValid && isSolutionsValid) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      if (onWrong) onWrong();
      
      // Reset otomatis hanya jika salah
      setTimeout(() => {
        setShowResult(false);
        setSelectedCauses([]);
        setSelectedSolutions([]);
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center bg-white rounded-[3rem] shadow-2xl border-8 border-slate-50">
      <div className="text-center mb-8">
        <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          Medical Analysis
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic mt-2">
          Misi 6: Analisis Hipertensi
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* DATA PASIEN CARD */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Activity size={120} />
          </div>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              <User />
            </div>
            <div>
              <h3 className="text-2xl font-black">Tn. Budi (45th)</h3>
              <p className="text-slate-400 font-bold text-sm">Status: Pasien Hipertensi</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <p className="text-red-400 text-[10px] font-black uppercase tracking-wider mb-1">Tekanan Darah</p>
              <p className="text-2xl font-mono font-bold text-white">150/95 <span className="text-sm">mmHg</span></p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Gejala & Gaya Hidup</p>
              <ul className="text-sm space-y-2 font-medium text-slate-300">
                <li>🧂 Diet tinggi natrium (garam)</li>
                <li>🏃‍♂️ Jarang olahraga</li>
                <li>😴 Kurang tidur & sering lembur</li>
                <li>🧬 Riwayat keluarga</li>
              </ul>
            </div>
          </div>
        </div>

        {/* INTERAKSI USER */}
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 uppercase text-sm flex items-center gap-2">
              <Utensils size={16} className="text-red-500" /> Identifikasi Penyebab:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {CAUSES_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleSelection(opt.id, "cause")}
                  className={`p-3 rounded-xl text-left text-sm font-bold border-2 transition-all flex justify-between items-center ${
                    selectedCauses.includes(opt.id)
                      ? "border-red-500 bg-red-50 text-red-700 shadow-md"
                      : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  {opt.label}
                  <div className={`w-5 h-5 rounded-md border-2 ${selectedCauses.includes(opt.id) ? "bg-red-500 border-red-500" : "border-slate-300"}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-slate-800 uppercase text-sm flex items-center gap-2">
              <Zap size={16} className="text-green-500" /> Rekomendasi Solusi:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {SOLUTIONS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleSelection(opt.id, "solution")}
                  className={`p-3 rounded-xl text-left text-sm font-bold border-2 transition-all flex justify-between items-center ${
                    selectedSolutions.includes(opt.id)
                      ? "border-green-500 bg-green-50 text-green-700 shadow-md"
                      : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  {opt.label}
                  <div className={`w-5 h-5 rounded-md border-2 ${selectedSolutions.includes(opt.id) ? "bg-green-500 border-green-500" : "border-slate-300"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RESULT & BUTTON */}
      <div className="mt-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.button
              key="btn-check"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCheck}
              disabled={selectedCauses.length === 0 || selectedSolutions.length === 0}
              // PERBAIKAN: text-white agar teks terlihat jelas
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl disabled:opacity-30 uppercase"
            >
              Check Analysis 🩺
            </motion.button>
          ) : (
            <motion.div
              key="result-msg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-5 rounded-2xl flex flex-col items-center gap-3 font-black text-white shadow-lg ${
                isCorrect ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? <CheckCircle2 /> : <XCircle />}
                {isCorrect ? "ANALISIS TEPAT!" : "ADA YANG SALAH!"}
              </div>
              
              {isCorrect && (
                <button
                  onClick={onComplete}
                  className="mt-2 w-full bg-white text-green-600 py-3 rounded-xl font-black uppercase text-sm hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Lanjut ke Misi Berikutnya 🚀
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}