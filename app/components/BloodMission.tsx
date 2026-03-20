"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BLOOD_DATA = [
  { 
    id: 1, 
    name: "Plasma", 
    icon: "💧", 
    info: "Cairan kuning pengangkut nutrisi, hormon, dan sisa metabolisme.", 
    ciri: "Terdiri dari 90% air." 
  },
  { 
    id: 2, 
    name: "Eritrosit", 
    icon: "🔴", 
    info: "Sel darah merah yang bertugas mengangkut oksigen ke seluruh tubuh.", 
    ciri: "Bentuk bikonkaf, tanpa inti." 
  },
  { 
    id: 3, 
    name: "Leukosit", 
    icon: "⚪", 
    info: "Sel darah putih yang berfungsi melawan kuman dan infeksi.", 
    ciri: "Memiliki inti sel." 
  },
  { 
    id: 4, 
    name: "Trombosit", 
    icon: "🩹", 
    info: "Keping darah yang berperan dalam pembekuan darah saat luka.", 
    ciri: "Ukurannya sangat kecil." 
  }
];

export default function BloodMission({ onComplete }: { onComplete: () => void }) {
  const [opened, setOpened] = useState<number[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const handleClick = (item: any) => {
    setSelected(item);
    if (!opened.includes(item.id)) {
      setOpened((prev) => [...prev, item.id]);
    }
  };

  const isAllOpened = opened.length === BLOOD_DATA.length;

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Grid Kartu */}
      <div className="grid grid-cols-2 gap-4">
        {BLOOD_DATA.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(item)}
            className={`p-6 rounded-[2rem] cursor-pointer border-4 transition-all flex flex-col items-center justify-center shadow-lg h-40 ${
              opened.includes(item.id) 
                ? 'bg-white border-green-400 shadow-green-100' 
                : 'bg-slate-800 border-slate-700 hover:border-blue-500'
            }`}
          >
            <span className="text-5xl mb-2">{item.icon}</span>
            <span className={`font-black uppercase text-xs tracking-widest ${
              opened.includes(item.id) ? 'text-slate-900' : 'text-white'
            }`}>
              {item.name}
            </span>
            {opened.includes(item.id) && (
              <span className="text-[10px] text-green-500 font-bold mt-1 uppercase">Dipelajari ✓</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Area Status & Tombol Next */}
      <div className="mt-10 min-h-[120px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {isAllOpened ? (
            <motion.div
              key="next-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center w-full"
            >
              <div className="bg-green-50 border-2 border-green-100 p-4 rounded-3xl mb-4 shadow-sm">
                <p className="text-green-700 font-black text-xs uppercase tracking-tighter">
                  🌟 Semua Komponen Berhasil Dianalisis!
                </p>
              </div>
              <button 
                onClick={onComplete}
                className="w-full bg-blue-500 text-black py-5 rounded-[2rem] font-black text-xl hover:bg-blue-400 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 border-b-8 border-blue-700"
              >
                MISI SELANJUTNYA 🚀
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden mb-2 mx-auto">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${(opened.length / 4) * 100}%` }}
                />
              </div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                Progress: {opened.length} / 4 Komponen
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Detail Pop-up */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-[3rem] max-w-sm w-full text-center shadow-2xl border-8 border-slate-100"
            >
              <div className="text-7xl mb-6 bg-slate-50 w-24 h-24 flex items-center justify-center rounded-3xl mx-auto border border-slate-200">
                {selected.icon}
              </div>
              
              <h2 className="text-3xl font-black mb-6 uppercase italic text-slate-900 leading-none tracking-tighter">
                {selected.name}
              </h2>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-widest">Fungsi Utama</p>
                  <p className="text-slate-900 font-bold leading-tight">{selected.info}</p>
                </div>
                <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm">
                  <p className="text-[10px] font-black text-red-600 uppercase mb-1 tracking-widest">Karakteristik</p>
                  <p className="text-slate-900 font-bold leading-tight">{selected.ciri}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelected(null)} 
                className="w-full bg-slate-200 text-black py-5 rounded-2xl font-black text-lg hover:bg-slate-300 transition-all shadow-md active:scale-95 border-b-4 border-slate-400"
              >
                MENGERTI!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}