"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const CLOTTING_STEPS: Step[] = [
  {
    id: 1,
    title: "Luka Terjadi",
    description: "Pembuluh darah rusak dan jaringan di sekitarnya terluka.",
    icon: "🩸",
    color: "border-red-500 bg-red-50",
  },
  {
    id: 2,
    title: "Agregasi Trombosit",
    description: "Trombosit berkumpul di area luka untuk membentuk sumbat sementara.",
    icon: "🧫",
    color: "border-orange-400 bg-orange-50",
  },
  {
    id: 3,
    title: "Pelepasan Tromboplastin",
    description: "Trombosit melepaskan enzim tromboplastin (trombokinase).",
    icon: "⚡",
    color: "border-yellow-400 bg-yellow-50",
  },
  {
    id: 4,
    title: "Aktivasi Protrombin",
    description: "Tromboplastin mengubah protrombin menjadi trombin dengan bantuan ion kalsium dan Vitamin K.",
    icon: "🧪",
    color: "border-blue-400 bg-blue-50",
  },
  {
    id: 5,
    title: "Pembentukan Fibrin",
    description: "Trombin mengubah fibrinogen (larut) menjadi benang-benang fibrin (tidak larut).",
    icon: "🕸️",
    color: "border-purple-400 bg-purple-50",
  },
  {
    id: 6,
    title: "Luka Tertutup",
    description: "Jaring fibrin memerangkap sel darah merah dan menutup luka secara permanen.",
    icon: "✅",
    color: "border-green-500 bg-green-50",
  },
];

export default function BloodClottingMission({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < CLOTTING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const isLastStep = currentStep === CLOTTING_STEPS.length - 1;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center min-h-[500px]">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 italic uppercase leading-none">
          Misi 3: Mekanisme Pembekuan
        </h2>
        <p className="text-slate-500 font-bold text-sm mt-2 uppercase tracking-widest">
          Pelajari proses pemulihan luka step-by-step
        </p>
      </div>

      {/* PROGRESS DOTS */}
      <div className="flex gap-2 mb-8">
        {CLOTTING_STEPS.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-8 rounded-full transition-all duration-500 ${
              index <= currentStep ? "bg-red-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* CARDS CONTAINER */}
      <div className="relative w-full flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {CLOTTING_STEPS.slice(0, currentStep + 1).map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`flex items-start gap-4 p-5 rounded-3xl border-2 shadow-sm ${step.color} ${
                index === currentStep ? "ring-4 ring-blue-100 border-blue-500" : "opacity-60 grayscale-[0.5]"
              }`}
            >
              <div className="bg-white min-w-[40px] h-[40px] rounded-full flex items-center justify-center font-black text-slate-800 shadow-inner border border-slate-200">
                {step.id}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{step.icon}</span>
                  <h3 className="font-black text-slate-800 uppercase tracking-tight italic">
                    {step.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-12 w-full flex justify-center">
        {!isLastStep ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStep}
            className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl flex items-center gap-3 hover:bg-blue-600 transition-colors uppercase"
          >
            Langkah Selanjutnya ➡️
          </motion.button>
        ) : (
          <motion.button
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={onComplete}
            className="bg-green-500 text-white px-12 py-6 rounded-[2rem] font-black text-2xl shadow-2xl hover:bg-green-400 transition-colors uppercase tracking-tight"
          >
            Selesaikan Pelatihan! 🚀
          </motion.button>
        )}
      </div>

      {/* FOOTER TIP */}
      <p className="mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
        Step {currentStep + 1} of 6
      </p>
    </div>
  );
}