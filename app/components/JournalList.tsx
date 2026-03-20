"use client"; // Tambahkan ini di paling atas
import { Trash2, Quote } from 'lucide-react';

// Jika import dari @/app/journal/page masih error, 
// lebih baik definisikan ulang interfacenya di sini agar mandiri
interface JournalEntry {
  id: string;
  date: string;
  topic: string;
  learned: string;
  challenging: string;
  application: string;
}

export default function JournalList({ 
  entries, 
  onDelete 
}: { 
  entries: JournalEntry[], 
  onDelete: (id: string) => void 
}) {
  
  if (!entries || entries.length === 0) return (
    <div className="text-center py-20 bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-300">
      <p className="font-bold text-slate-400 uppercase tracking-widest">Belum ada jurnal tersimpan.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <div 
          key={entry.id} 
          className="bg-white border-4 border-black p-6 rounded-[2rem] shadow-[8px_8px_0_0_#000] relative group transition-all"
        >
          {/* Tombol Hapus */}
          <button 
            onClick={() => onDelete(entry.id)}
            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Hapus Jurnal"
          >
            <Trash2 size={18} />
          </button>

          {/* Header Kartu */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
             <span className="bg-yellow-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 border-black shadow-[3px_3px_0_0_#000]">
               {entry.topic}
             </span>
             <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full uppercase">
               {entry.date}
             </span>
          </div>

          {/* Konten Refleksi */}
          <div className="space-y-6">
            <div className="bg-indigo-50/50 p-4 rounded-2xl border-2 border-indigo-100">
              <h4 className="text-[10px] font-black uppercase text-indigo-600 mb-2 flex items-center gap-2">
                <Quote size={14} fill="currentColor" /> Hari ini saya belajar:
              </h4>
              <p className="text-sm font-bold leading-relaxed text-slate-700">
                {entry.learned}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <h5 className="text-[10px] font-black uppercase text-slate-400 mb-2 italic">Tantangan Terbesar:</h5>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  {entry.challenging || '-'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <h5 className="text-[10px] font-black uppercase text-slate-400 mb-2 italic">Penerapan Nyata:</h5>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  {entry.application || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}