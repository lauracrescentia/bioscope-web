"use client";

import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";

// --- DATA DEFINITION ---
const LEUKOCYTE_TYPES = [
  { id: "neutrofil", name: "Neutrofil", category: "Granulosit", icon: "🧬" },
  { id: "eosinofil", name: "Eosinofil", category: "Granulosit", icon: "🧪" },
  { id: "basofil", name: "Basofil", category: "Granulosit", icon: "🧼" },
  { id: "limfosit", name: "Limfosit", category: "Agranulosit", icon: "🛡️" },
  { id: "monosit", name: "Monosit", category: "Agranulosit", icon: "👾" },
];

const CATEGORIES = ["Granulosit", "Agranulosit"];

// --- DRAGGABLE ITEM COMPONENT ---
const DraggableLeukocyte = ({ item, isDropped }: { item: any; isDropped: boolean }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "LEUKOCYTE",
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  if (isDropped) return null;

  return (
    <div
      ref={drag as any}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="bg-white border-2 border-slate-200 p-4 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 transition-all flex items-center gap-3"
    >
      <span className="text-2xl">{item.icon}</span>
      <span className="font-bold text-slate-700">{item.name}</span>
    </div>
  );
};

// --- DROP ZONE COMPONENT ---
const DropZone = ({ category, items, onDrop }: { category: string; items: any[]; onDrop: (id: string) => void }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "LEUKOCYTE",
    drop: (item: { id: string }) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop as any}
      className={`min-h-[200px] p-4 rounded-[2rem] border-4 border-dashed transition-all ${
        isOver ? "bg-blue-50 border-blue-400 scale-[1.02]" : "bg-slate-50 border-slate-200"
      }`}
    >
      <h3 className="text-center font-black uppercase text-slate-400 text-xs tracking-widest mb-4">
        Target: {category}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={item.id}
            className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2"
          >
            <span>{item.icon}</span>
            <span className="font-bold text-sm text-slate-600">{item.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN MISSION COMPONENT ---
export default function LeukocyteDragDropMission({ onComplete }: { onComplete: () => void }) {
  const [placements, setPlacements] = useState<{ [key: string]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleDrop = (id: string, category: string) => {
    setPlacements((prev) => ({ ...prev, [id]: category }));
  };

  const checkAnswers = () => {
    const allCorrect = LEUKOCYTE_TYPES.every(
      (type) => placements[type.id] === type.category
    );

    setShowResult(true);
    if (allCorrect) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      // Reset after 2 seconds if wrong
      setTimeout(() => {
        setPlacements({});
        setShowResult(false);
        setIsCorrect(null);
      }, 2000);
    }
  };

  const isAllPlaced = Object.keys(placements).length === LEUKOCYTE_TYPES.length;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-4xl mx-auto p-4">
        <header className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 italic uppercase">
            Misi 2: Klasifikasi Leukosit
          </h2>
          <p className="text-slate-500 font-bold text-sm">
            Tarik sel ke kategori yang benar berdasarkan strukturnya!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* LEFT: DRAG ITEMS */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">
              Daftar Sel
            </h4>
            <div className="space-y-3">
              {LEUKOCYTE_TYPES.map((item) => (
                <DraggableLeukocyte 
                  key={item.id} 
                  item={item} 
                  isDropped={!!placements[item.id]} 
                />
              ))}
              {isAllPlaced && !showResult && (
                <p className="text-green-500 font-bold text-xs text-center animate-pulse">
                  Semua telah ditempatkan!
                </p>
              )}
            </div>
          </div>

          {/* RIGHT: DROP ZONES */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <DropZone
                key={cat}
                category={cat}
                onDrop={(id) => handleDrop(id, cat)}
                items={LEUKOCYTE_TYPES.filter((t) => placements[t.id] === cat)}
              />
            ))}
          </div>
        </div>

        {/* CONTROLS & FEEDBACK */}
        <div className="mt-12 flex flex-col items-center justify-center min-h-[100px]">
          <AnimatePresence>
            {isAllPlaced && !showResult && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                onClick={checkAnswers}
                className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-600 shadow-2xl transition-all"
              >
                CHECK ANSWER 🔍
              </motion.button>
            )}

            {showResult && isCorrect === true && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black mb-4 shadow-lg">
                  BENAR! 🌟
                </div>
                <button
                  onClick={onComplete}
                  className="bg-blue-600 text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-500 shadow-2xl transition-all"
                >
                  NEXT MISSION 🚀
                </button>
              </motion.div>
            )}

            {showResult && isCorrect === false && (
              <motion.div
                initial={{ x: [-10, 10, -10, 10, 0], opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-red-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg"
              >
                SALAH, COBA LAGI! ❌
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DndProvider>
  );
}