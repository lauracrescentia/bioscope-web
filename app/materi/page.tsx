"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MateriPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'id' | 'en'>('id');

  const t = {
    id: {
      title: "Materi Pembelajaran",
      subtitle: "Pilih modul biologi dalam format PDF untuk dipelajari.",
      back: "Kembali ke Dashboard",
      read: "Baca Sekarang",
      list: [
        { id: 1, title: "Sistem Pernapasan", file: "/pernapasan.pdf", desc: "Mempelajari proses pertukaran gas pada manusia.", icon: "🫁" },
        { id: 2, title: "Sistem Ekskresi", file: "/ekskresi.pdf", desc: "Mempelajari pembuangan zat sisa metabolisme tubuh.", icon: "🧪" }
      ]
    },
    en: {
      title: "Learning Materials",
      subtitle: "Choose a biology module in PDF format to study.",
      back: "Back to Dashboard",
      read: "Read Now",
      list: [
        { id: 1, title: "Respiratory System", file: "/pernapasan.pdf", desc: "Study the process of gas exchange in humans.", icon: "🫁" },
        { id: 2, title: "Excretory System", file: "/ekskresi.pdf", desc: "Study the removal of metabolic waste from the body.", icon: "🧪" }
      ]
    }
  }[lang];

  return (
    <main className="min-h-screen bg-slate-50 text-black p-8 font-sans">
      {/* Header & Switch Bahasa */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-green-600 font-bold flex items-center gap-2 hover:underline"
        >
          ← {t.back}
        </button>
        <div className="flex gap-2">
          <button onClick={() => setLang('id')} className={`px-4 py-1 rounded-lg font-bold ${lang === 'id' ? 'bg-green-600 text-white' : 'bg-white shadow'}`}>ID</button>
          <button onClick={() => setLang('en')} className={`px-4 py-1 rounded-lg font-bold ${lang === 'en' ? 'bg-green-600 text-white' : 'bg-white shadow'}`}>EN</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-black text-slate-800 mb-2">{t.title}</h1>
        <p className="text-slate-500">{t.subtitle}</p>
      </div>

      {/* Daftar Materi PDF */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {t.list.map((materi) => (
          <div key={materi.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-start gap-4 hover:shadow-xl transition-all group">
            <div className="text-5xl mb-2">{materi.icon}</div>
            <h3 className="text-2xl font-bold text-slate-800">{materi.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{materi.desc}</p>
            
            <a 
              href={materi.file} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 w-full bg-green-600 text-white text-center py-4 rounded-2xl font-bold hover:bg-green-700 transition active:scale-95 flex items-center justify-center gap-2"
            >
              📄 {t.read}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}