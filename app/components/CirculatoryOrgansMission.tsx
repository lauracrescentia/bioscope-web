"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Organ {
  id: string;
  name: string;
  function: string;
  description: string;
  icon: string;
  color: string;
}

const ORGANS_DATA: Organ[] = [
  {
    id: "jantung",
    name: "Jantung",
    function: "Memompa darah ke seluruh tubuh",
    description: "Organ otot seukuran kepalan tangan yang bekerja tanpa henti.",
    icon: "❤️",
    color: "bg-red-500",
  },
  {
    id: "arteri",
    name: "Arteri",
    function: "Membawa darah keluar jantung",
    description: "Pembuluh tebal yang mengalirkan darah kaya oksigen.",
    icon: "🔴",
    color: "bg-rose-600",
  },
  {
    id: "vena",
    name: "Vena",
    function: "Membawa darah kembali ke jantung",
    description: "Pembuluh yang membawa darah rendah oksigen kembali ke jantung.",
    icon: "🔵",
    color: "bg-blue-600",
  },
  {
    id: "kapiler",
    name: "Kapiler",
    function: "Tempat pertukaran zat",
    description: "Pembuluh terkecil tempat pertukaran oksigen dan nutrisi.",
    icon: "🕸️",
    color: "bg-purple-500",
  },
];

export default function CirculatoryOrgansMission({ onComplete }: { onComplete: () => void }) {
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(null);
  const [clickedOrgans, setClickedOrgans] = useState<string[]>([]);

  const handleOrganClick = (organ: Organ) => {
    setSelectedOrgan(organ);
    if (!clickedOrgans.includes(organ.id)) {
      setClickedOrgans((prev) => [...prev, organ.id]);
    }
  };

  const isAllExplored = clickedOrgans.length === ORGANS_DATA.length;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-900 italic uppercase">
          Misi 4: Anatomi Sistem
        </h2>
        <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest">
          Klik untuk mempelajari setiap organ ({clickedOrgans.length}/{ORGANS_DATA.length})
        </p>
      </div>

      {/* CONTAINER JEJER KE SAMPING (ROW) */}
      <div className="flex flex-wrap justify-center items-center gap-8 w-full py-12 bg-white rounded-[3rem] border-8 border-slate-100 shadow-inner">
        {ORGANS_DATA.map((organ) => (
          <motion.button
            key={organ.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOrganClick(organ)}
            className="relative flex flex-col items-center"
          >
            {/* Box Ikon */}
            <div className={`w-28 h-28 ${organ.color} rounded-[2.5rem] shadow-xl flex items-center justify-center text-5xl transition-all border-4 ${clickedOrgans.includes(organ.id) ? 'border-green-400' : 'border-white'}`}>
              {organ.icon}
            </div>
            
            {/* Label Nama */}
            <div className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg">
              {organ.name}
            </div>

            {/* Checklist Selesai */}
            {clickedOrgans.includes(organ.id) && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl border-4 border-white shadow-lg"
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* POPUP INFO */}
      <AnimatePresence>
        {selectedOrgan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] shadow-2xl p-10 max-w-md w-full text-center border-b-8 border-slate-200"
            >
              <div className={`w-24 h-24 ${selectedOrgan.color} rounded-3xl mx-auto mb-6 flex items-center justify-center text-5xl shadow-lg`}>
                {selectedOrgan.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 uppercase italic mb-2">{selectedOrgan.name}</h3>
              <div className="bg-red-50 text-red-600 py-2 px-4 rounded-xl font-bold text-sm mb-6 inline-block">
                {selectedOrgan.function}
              </div>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">{selectedOrgan.description}</p>
              <button
                onClick={() => setSelectedOrgan(null)}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase hover:bg-red-600 transition-colors"
              >
                Paham! ➜
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOMBOL FINISH */}
      <div className="mt-12 h-20">
        {isAllExplored && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            className="bg-green-500 text-white px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:bg-green-400 transition-all uppercase italic flex items-center gap-4"
          >
            Selesaikan Pelatihan 🎓
          </motion.button>
        )}
      </div>
    </div>
  );
}