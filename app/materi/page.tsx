"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowLeft, Globe, FileText, CheckCircle2 } from 'lucide-react';

export default function MateriPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [progress, setProgress] = useState<{ [key: number]: number }>({});

  // Load progress dari localStorage biar tidak hilang saat refresh
  useEffect(() => {
    const savedProgress = localStorage.getItem('bioscope_progress');
    if (savedProgress) setProgress(JSON.parse(savedProgress));
  }, []);

  const updateProgress = (id: number) => {
    const current = progress[id] || 0;
    const next = current >= 100 ? 0 : current + 25; // Nambah 25% setiap klik
    const newProgress = { ...progress, [id]: next };
    setProgress(newProgress);
    localStorage.setItem('bioscope_progress', JSON.stringify(newProgress));
  };

  const t = {
    id: {
      title: "Materi Pembelajaran",
      subtitle: "Pilih modul biologi dalam format PDF untuk dipelajari.",
      back: "Dashboard",
      read: "Buka PDF",
      done: "Selesai",
      list: [
        { id: 1, title: "Sistem Pernapasan", file: "/pernapasan.pdf", desc: "Proses pertukaran gas pada manusia.", icon: "🫁", color: "#4f46e5" },
        { id: 2, title: "Sistem Ekskresi", file: "/ekskresi.pdf", desc: "Pembuangan zat sisa metabolisme tubuh.", icon: "🧪", color: "#059669" }
      ]
    },
    en: {
      title: "Learning Materials",
      subtitle: "Choose a biology module in PDF format to study.",
      back: "Dashboard",
      read: "Open PDF",
      done: "Completed",
      list: [
        { id: 1, title: "Respiratory System", file: "/pernapasan.pdf", desc: "Gas exchange process in humans.", icon: "🫁", color: "#4f46e5" },
        { id: 2, title: "Excretory System", file: "/ekskresi.pdf", desc: "Removal of metabolic waste.", icon: "🧪", color: "#059669" }
      ]
    }
  }[lang];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-black p-4 md:p-8 font-sans">
      
      {/* Navbar Minimalis */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 font-black uppercase text-xs bg-white border-4 border-black px-6 py-2 rounded-full shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <ArrowLeft size={16} /> {t.back}
        </button>
        
        <div className="flex bg-white border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0_0_#000]">
          <button onClick={() => setLang('id')} className={`px-4 py-2 font-black text-xs ${lang === 'id' ? 'bg-yellow-400' : 'bg-white hover:bg-slate-50'}`}>ID</button>
          <button onClick={() => setLang('en')} className={`px-4 py-2 font-black text-xs border-l-4 border-black ${lang === 'en' ? 'bg-yellow-400' : 'bg-white hover:bg-slate-50'}`}>EN</button>
        </div>
      </div>

      {/* Header Utama */}
      <div className="max-w-5xl mx-auto mb-12 space-y-2">
        <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-slate-900">
          {t.title}
        </h1>
        <p className="text-lg font-bold text-slate-500 max-w-xl">{t.subtitle}</p>
      </div>

      {/* Grid Materi */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {t.list.map((materi) => {
          const prog = progress[materi.id] || 0;
          return (
            <div 
              key={materi.id} 
              className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[12px_12px_0_0_#000] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex flex-col relative overflow-hidden"
            >
              {/* Badge Progress */}
              <div className="absolute top-6 right-8 flex items-center gap-2">
                {prog === 100 && <CheckCircle2 className="text-green-500" size={24} />}
                <span className="font-black italic text-2xl">{prog}%</span>
              </div>

              <div className="text-6xl mb-6 bg-slate-50 w-20 h-20 flex items-center justify-center rounded-3xl border-2 border-black shadow-[4px_4px_0_0_#000]">
                {materi.icon}
              </div>

              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{materi.title}</h3>
              <p className="font-bold text-slate-500 mb-8 leading-tight">{materi.desc}</p>
              
              {/* Progress Bar Mini */}
              <div className="w-full h-4 bg-slate-100 border-2 border-black rounded-full mb-8 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 border-r-2 border-black transition-all duration-500" 
                  style={{ width: `${prog}%` }}
                />
              </div>

              <div className="mt-auto grid grid-cols-2 gap-4">
                <a 
                  href={materi.file} 
                  target="_blank" 
                  className="bg-white border-4 border-black py-4 rounded-2xl font-black uppercase italic text-center shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={18} /> {t.read}
                </a>
                
                <button 
                  onClick={() => updateProgress(materi.id)}
                  className="bg-yellow-400 border-4 border-black py-4 rounded-2xl font-black uppercase italic shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  {prog === 100 ? "Reset" : "+ Progress"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="max-w-5xl mx-auto mt-20 text-center">
        <div className="inline-block bg-indigo-50 border-2 border-indigo-200 px-6 py-3 rounded-full font-bold text-indigo-600 animate-bounce">
          💡 Tips: Klik "+ Progress" setiap kamu menyelesaikan satu sub-bab PDF!
        </div>
      </div>
    </main>
  );
}