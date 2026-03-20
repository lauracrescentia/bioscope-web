"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookText, ArrowLeft, Sparkles, Trash2, Quote, Calendar, Hash } from 'lucide-react';

// --- BAGIAN 1: INTERFACE ---
export interface JournalEntry {
  id: string;
  date: string;
  topic: string;
  learned: string;
  challenging: string;
  application: string;
}

// --- BAGIAN 2: KOMPONEN FORM (Langsung di sini) ---
function JournalForm({ onSave }: { onSave: (entry: Omit<JournalEntry, 'id' | 'date'>) => void }) {
  const [formData, setFormData] = useState({ topic: '', learned: '', challenging: '', application: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim() || !formData.learned.trim()) return alert("Isi topik dulu ya! 😊");
    onSave(formData);
    setFormData({ topic: '', learned: '', challenging: '', application: '' });
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-[8px_8px_0_0_#6366f1] space-y-4">
      <h3 className="font-black uppercase text-xl italic text-indigo-600">Tulis Jurnal Baru ✍️</h3>
      <input type="text" placeholder="Topik Pembelajaran" className="w-full p-3 rounded-xl border-2 border-black font-bold text-black" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} />
      <textarea placeholder="Apa yang dipelajari?" className="w-full p-3 h-24 rounded-xl border-2 border-black font-medium text-black" value={formData.learned} onChange={(e) => setFormData({...formData, learned: e.target.value})} />
      <textarea placeholder="Tantangan?" className="w-full p-3 h-20 rounded-xl border-2 border-black font-medium text-black" value={formData.challenging} onChange={(e) => setFormData({...formData, challenging: e.target.value})} />
      <textarea placeholder="Penerapan?" className="w-full p-3 h-20 rounded-xl border-2 border-black font-medium text-black" value={formData.application} onChange={(e) => setFormData({...formData, application: e.target.value})} />
      <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl border-2 border-black font-black uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">Simpan 🚀</button>
    </form>
  );
}

// --- BAGIAN 3: KOMPONEN LIST (Langsung di sini) ---
function JournalList({ entries, onDelete }: { entries: JournalEntry[], onDelete: (id: string) => void }) {
  if (entries.length === 0) return <div className="text-center py-10 bg-slate-100 rounded-3xl border-4 border-dashed border-slate-300 font-black text-slate-400">JURNAL KOSONG 📖</div>;
  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white border-4 border-black p-6 rounded-[2rem] shadow-[8px_8px_0_0_#000] relative group">
          <button onClick={() => onDelete(entry.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
          <div className="flex gap-2 mb-4">
            <span className="bg-yellow-300 px-3 py-1 rounded-full text-[10px] font-black border-2 border-black uppercase">{entry.topic}</span>
            <span className="text-[10px] font-black text-slate-400">{entry.date}</span>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-100 mb-4">
            <p className="text-sm font-bold text-slate-700 italic">"{entry.learned}"</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[10px] font-bold">
            <div className="p-3 bg-slate-50 rounded-xl"> <span className="text-orange-500 uppercase">Tantangan:</span> <p>{entry.challenging || '-'}</p> </div>
            <div className="p-3 bg-slate-50 rounded-xl"> <span className="text-green-500 uppercase">Penerapan:</span> <p>{entry.application || '-'}</p> </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- BAGIAN UTAMA (JournalPage) ---
export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('bioscope_journals');
    if (saved) setEntries(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  const saveEntry = (dataForm: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry = { ...dataForm, id: Date.now().toString(), date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('bioscope_journals', JSON.stringify(updated));
  };

  const deleteEntry = (id: string) => {
    if (confirm("Hapus jurnal ini?")) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      localStorage.setItem('bioscope_journals', JSON.stringify(updated));
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 font-black uppercase text-xs bg-white border-2 border-black px-5 py-2.5 rounded-full shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          <ArrowLeft size={16} /> Dashboard
        </button>

        <div className="bg-white p-8 rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0_0_#000] flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Learning Journal</h1>
            <p className="text-slate-500 font-bold flex items-center gap-2"><Sparkles size={18} className="text-yellow-500" /> Progres belajarmu hari ini.</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0_0_#000] text-center min-w-[100px]">
            <p className="text-[10px] font-black uppercase text-indigo-600">Total</p>
            <p className="text-3xl font-black">{entries.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5"> <JournalForm onSave={saveEntry} /> </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4 bg-white p-5 rounded-3xl border-4 border-black shadow-[6px_6px_0_0_#4f46e5]">
              <BookText className="text-indigo-600" size={24} />
              <input type="text" placeholder="Cari topik..." className="flex-1 outline-none font-bold bg-transparent text-lg text-black" value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <JournalList entries={entries.filter(e => e.topic.toLowerCase().includes(filter.toLowerCase()))} onDelete={deleteEntry} />
          </div>
        </div>
      </div>
    </div>
  );
}