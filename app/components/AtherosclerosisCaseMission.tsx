"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Activity, TrendingUp, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

// Registrasi ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  onComplete: () => void;
  onWrong?: () => void;
}

const RISK_OPTIONS = [
  { id: "r1", label: "Penyumbatan pembuluh darah (Plak)", isCorrect: true },
  { id: "r2", label: "Risiko serangan jantung koroner", isCorrect: true },
  { id: "r3", label: "Risiko tekanan darah terlalu rendah", isCorrect: false },
  { id: "r4", label: "Risiko Stroke", isCorrect: true },
];

const SOLUTION_OPTIONS = [
  { id: "s1", label: "Kurangi lemak jenuh & gorengan", isCorrect: true },
  { id: "s2", label: "Rutin olahraga kardio", isCorrect: true },
  { id: "s3", label: "Berhenti merokok", isCorrect: true },
  { id: "s4", label: "Menambah konsumsi gula tinggi", isCorrect: false },
];

export default function AtherosclerosisCaseMission({ onComplete, onWrong }: Props) {
  const [mounted, setMounted] = useState(false);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const data: any = {
    labels: ['LDL', 'HDL', 'TG'],
    datasets: [
      {
        data: [190, 30, 240],
        backgroundColor: ['#ef4444', '#22c55e', '#f97316'],
        borderRadius: 8,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  const handleToggle = (id: string, type: "risk" | "solution") => {
    setIsError(false);
    if (type === "risk") {
      setSelectedRisks(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setSelectedSolutions(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }
  };

  const validate = () => {
    const correctRisks = RISK_OPTIONS.filter(o => o.isCorrect).map(o => o.id);
    const correctSols = SOLUTION_OPTIONS.filter(o => o.isCorrect).map(o => o.id);

    const rValid = selectedRisks.length === correctRisks.length && selectedRisks.every(r => correctRisks.includes(r));
    const sValid = selectedSolutions.length === correctSols.length && selectedSolutions.every(s => correctSols.includes(s));

    if (rValid && sValid) {
      setShowResult(true);
    } else {
      setIsError(true);
      if (onWrong) onWrong();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Activity className="text-red-500" />
          <h2 className="font-black uppercase tracking-tighter italic text-xl">Analisis Plak Arteri</h2>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Area: Chart */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 h-64 flex flex-col">
             <p className="text-[10px] font-black text-slate-500 mb-2 uppercase text-center">Kadar Lemak Darah (mg/dL)</p>
             <div className="flex-1">
                <Bar data={data} options={options} />
             </div>
          </div>

          {/* Right Area: Options */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pilih Diagnosis & Solusi:</p>
            <div className="grid gap-2">
              {RISK_OPTIONS.concat(SOLUTION_OPTIONS).map(opt => {
                const isRisk = opt.id.startsWith('r');
                const isSelected = isRisk ? selectedRisks.includes(opt.id) : selectedSolutions.includes(opt.id);
                
                return (
                  <button 
                    key={opt.id}
                    onClick={() => handleToggle(opt.id, isRisk ? "risk" : "solution")}
                    className={`w-full text-left p-3 rounded-xl border-2 font-black text-[11px] transition-all uppercase ${
                      isSelected 
                        ? "border-red-600 bg-red-50 text-black shadow-inner scale-[0.98]" 
                        : "border-slate-200 bg-white text-black hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-sm border ${isSelected ? "bg-red-600 border-red-600" : "bg-white border-slate-300"}`} />
                      {opt.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-8 border-t pt-8">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <div className="flex flex-col items-center gap-4">
                {isError && (
                  <motion.div initial={{y: 10}} animate={{y: 0}} className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase">
                    <AlertCircle size={14}/> Analisis Medis Salah! Periksa data LDL & Trigliserida.
                  </motion.div>
                )}
                <button 
                  onClick={validate} 
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-red-600 transition-all uppercase shadow-xl active:scale-95"
                >
                  Verifikasi Diagnosis 🧪
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-600 p-8 rounded-[2rem] text-center text-white shadow-2xl shadow-green-100"
              >
                <CheckCircle2 size={48} className="mx-auto mb-4" />
                <h3 className="text-2xl font-black uppercase italic mb-6">Misi Selesai: Arteri Bersih!</h3>
                <button 
                  onClick={onComplete} 
                  className="bg-white text-green-600 px-12 py-4 rounded-2xl font-black uppercase text-xl hover:bg-slate-100 transition-colors shadow-lg"
                >
                  LULUS PELATIHAN 🎓
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}