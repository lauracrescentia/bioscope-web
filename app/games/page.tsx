"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, LogOut } from "lucide-react"; // Menambahkan LogOut icon

// Import hooks & components
import useGameState from "../hooks/useGameState"; 
import BloodMission from "../components/BloodMission";
import LeukocyteDragDropMission from "../components/LeukocyteDragDropMission";
import BloodClottingMission from "../components/BloodClottingMission";
import CirculatoryOrgansMission from "../components/CirculatoryOrgansMission";
import BloodCirculationMission from "../components/BloodCirculationMission";
import HypertensionCaseMission from "../components/HypertensionCaseMission";
import AtherosclerosisCaseMission from "../components/AtherosclerosisCaseMission";

export default function GamePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [progress, setProgress] = useState(0);
  const game = useGameState();

  const handleExit = () => {
    if (confirm("Apakah Anda yakin ingin keluar? Progres pelatihan akan dihapus.")) {
      game.resetGame();
      setProgress(0);
      setName("");
      setAvatar("");
      router.push("/");
    }
  };

  // --- 1. LAYAR SETUP (INPUT NAMA) ---
  if (!game.started) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 relative">
        {/* Tombol Keluar (Ikon) di pojok kiri atas */}
        <button 
          onClick={() => router.push("/")}
          className="absolute top-8 left-8 p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-red-500 hover:border-red-500/50 transition-all shadow-xl group"
          title="Kembali ke Beranda"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl w-full max-w-md text-center"
        >
          <h1 className="text-3xl font-black mb-2 italic text-red-500 uppercase tracking-tighter">Bio Explorer</h1>
          <p className="text-slate-500 text-[10px] font-black tracking-widest mb-8 uppercase">Registrasi Agen Baru</p>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="NAMA AGEN..."
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              className="w-full bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl font-bold text-center focus:border-red-500 outline-none transition-all text-white placeholder:opacity-30"
            />

            <div className="flex justify-center gap-4 py-4">
              {["🧑‍🔬", "👩‍⚕️", "👨‍⚕️"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`text-4xl p-4 rounded-3xl border-4 transition-all ${
                    avatar === a ? "bg-red-600 border-white scale-110 shadow-lg" : "bg-slate-800 border-slate-700 opacity-40 hover:opacity-100"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            <button
              disabled={!name || !avatar}
              onClick={() => {
                game.setStarted(true);
                setProgress(10); 
              }}
              className="w-full bg-red-600 py-5 rounded-2xl font-black text-xl hover:bg-red-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl text-white uppercase"
            >
              Mulai Pelatihan 🚀
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  // --- 2. LAYAR UTAMA GAME (HUD & MISI) ---
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <nav className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-50 border-b border-slate-100">
        <div className="flex gap-4">
          <button 
            onClick={handleExit}
            className="flex items-center gap-2 bg-slate-100 text-black px-4 py-2 rounded-xl font-black text-[10px] hover:bg-red-100 hover:text-red-600 transition-all uppercase border-b-4 border-slate-200"
          >
            <ChevronLeft size={14} /> Kembali
          </button>
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 font-black flex items-center gap-2 text-xs">
            ❤️ {game.lives}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none text-right">Agen Aktif</p>
            <p className="font-bold text-slate-700 text-xs">{name} {avatar}</p>
          </div>
          <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl border border-slate-200 font-mono font-bold text-xs">
            ⏱️ {game.time}s
          </div>
        </div>
      </nav>

      <div className="w-full h-2 bg-slate-200 overflow-hidden">
        <motion.div 
          className="h-full bg-red-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {progress === 10 && (
            <motion.div key="misi1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
              <BloodMission onComplete={() => setProgress(25)} />
            </motion.div>
          )}

          {progress === 25 && (
            <motion.div key="t1" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center p-12 bg-white rounded-[3rem] shadow-xl border-4 border-blue-50 max-w-md">
              <div className="text-7xl mb-4">🧪</div>
              <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-tight">Analisis Sampel<br/>Berhasil!</h2>
              <button 
                onClick={() => setProgress(40)} 
                className="w-full bg-blue-400 text-black py-4 rounded-2xl font-black mt-8 hover:bg-blue-300 border-b-4 border-blue-600 uppercase transition-all active:scale-95"
              >
                Identifikasi Sel 🛡️
              </button>
            </motion.div>
          )}

          {progress === 40 && <LeukocyteDragDropMission onComplete={() => setProgress(55)} />}
          
          {progress === 55 && (
            <motion.div key="t2" className="text-center p-12 bg-white rounded-[3rem] shadow-xl border-4 border-red-50 max-w-md">
              <div className="text-7xl mb-4">🛡️</div>
              <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-tight">Pertahanan Darah<br/>Sangat Kuat!</h2>
              <button 
                onClick={() => setProgress(70)} 
                className="w-full bg-red-400 text-black py-4 rounded-2xl font-black mt-8 hover:bg-red-300 border-b-4 border-red-600 uppercase transition-all active:scale-95"
              >
                Atasi Luka 🩸
              </button>
            </motion.div>
          )}

          {progress === 70 && <BloodClottingMission onComplete={() => setProgress(80)} />}
          {progress === 80 && <CirculatoryOrgansMission onComplete={() => setProgress(90)} />}
          {progress === 90 && <BloodCirculationMission onComplete={() => setProgress(95)} />}

          {progress === 95 && (
            <HypertensionCaseMission 
              onComplete={() => setProgress(98)} 
              onWrong={() => game.loseLife()} 
            />
          )}

          {progress === 98 && (
            <AtherosclerosisCaseMission 
              onComplete={() => setProgress(100)} 
              onWrong={() => game.loseLife()} 
            />
          )}

          {progress === 100 && (
            <motion.div key="end" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-slate-50 max-w-2xl">
              <div className="text-9xl mb-8 animate-bounce">🎓</div>
              <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter italic uppercase">Master Bio Explorer!</h2>
              <p className="text-slate-500 font-bold text-xl mb-12 uppercase">
                {name} {avatar}
              </p>
              <button 
                onClick={handleExit} 
                className="bg-slate-950 text-white px-12 py-6 rounded-3xl font-black text-2xl hover:bg-red-600 shadow-2xl transition-all uppercase"
              >
                Menu Utama 🔄
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {game.showPower && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={game.usePower}
            className="fixed bottom-10 right-10 bg-yellow-400 w-20 h-20 rounded-full text-4xl shadow-2xl border-4 border-white z-50 animate-bounce"
          >
            ⚡
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}