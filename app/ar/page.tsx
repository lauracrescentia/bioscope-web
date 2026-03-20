"use client";

import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Box,
  ScanLine,
  Home,
  Grid,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ARPage() {
  const router = useRouter();
  const arScannerUrl = "https://sites.google.com/view/bioscopear-bio-mp/home";

  return (
    <main className="fixed inset-0 bg-slate-50 flex flex-col font-sans overflow-hidden text-black">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-[99999] bg-white/80 backdrop-blur-md border-b border-slate-100">
        
        {/* KIRI: Navigasi Internal */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-black text-xs hover:bg-green-700 transition-all shadow-lg active:scale-95"
          >
            <Grid size={16} /> Menu Utama
          </button>
          
          {/* Label Modul (Versi Desktop) */}
          <div className="bg-slate-100 text-slate-500 px-3 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hidden sm:flex items-center gap-2 border border-slate-200">
            <ScanLine size={14} /> AR Module
          </div>
        </div>

        {/* KANAN: Tombol Home & Status */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hidden md:flex items-center gap-2 shadow-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Online
          </div>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-500 rounded-xl font-bold text-xs hover:bg-red-50 hover:border-red-200 transition-all shadow-md border border-slate-200 active:scale-95"
          >
            <Home size={16} /> Keluar ke Home
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT - Tetap justify-end agar card di kanan */}
      <div className="flex-1 w-full h-full flex items-center justify-end pr-8 md:pr-20 lg:pr-32 p-6 relative">
        
        {/* BACKGROUND DECORATION */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md lg:max-w-lg aspect-square bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center justify-center text-center gap-8 z-10"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center relative shadow-inner">
            <Box size={48} />
            <div className="absolute inset-0 border-2 border-green-200 rounded-[2.5rem] animate-ping opacity-25"></div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 uppercase italic leading-tight">
              BioScope <span className="text-green-600">AR Scanner</span>
            </h1>

            <p className="text-slate-500 text-xs md:text-base font-medium max-w-xs mx-auto">
              Siap menjelajahi dunia biologi? Klik tombol di bawah untuk membuka modul AR.
            </p>
          </div>

          <button
            onClick={() => window.open(arScannerUrl, "_blank")}
            className="group w-full max-w-xs py-4 md:py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm md:text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-200 active:scale-95"
          >
            Buka Scanner AR
            <ExternalLink
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          <div className="pt-4 border-t w-full border-slate-50">
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">
              Powered by Google Sites & Assemblr
            </p>
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="p-6 text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em] relative z-20">
        © CRESCENTIA LAURA 2026 • BIOscope Lab
      </footer>
    </main>
  );
}