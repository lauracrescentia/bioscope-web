"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookText, ArrowLeft, Sparkles, Trash2, Quote, Calendar, Hash, Smile } from 'lucide-react';

// --- BAGIAN 1: INTERFACE ---
export interface JournalEntry {
  id: string;
  date: string;
  topic: string;
  learned: string;
  challenging: string;
  application: string;
  mood: string; // Tambahan field mood
}

// --- BAGIAN 2: KOMPONEN FORM ---
function JournalForm({ onSave }: { onSave: (entry: Omit<JournalEntry, 'id' | 'date'>) => void }) {
  const [formData, setFormData] = useState({ 
    topic: '', 
    learned: '', 
    challenging: '', 
    application: '', 
    mood: '😊' 
  });

  const moods = [
    { emoji: '😊', label: 'Senang' },
    { emoji: '🤯', label: 'Pusing' },
    { emoji: '🤔', label: 'Bingung' },
    { emoji: '🚀', label: 'Semangat' },
    { emoji: '😴', label: 'Lelah' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim() || !formData.learned.trim()) return alert("Isi topik dan apa yang dipelajari dulu ya! 😊");
    onSave(formData);
    setFormData({ topic: '', learned: '', challenging: '', application: '', mood: '😊' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-[8px_8px_0_0_#6366f1] space-y-4">
      <h3 className="font-black uppercase text-xl italic text-indigo-600 flex items-center gap-2">
        Refleksi Belajar ✍️
      </h3>

      {/* MOOD PICKER */}
      <div className="bg-slate-50 p-4 rounded-2xl border-2 border-black">
        <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Bagaimana perasaanmu?</p>
        <div className="flex justify-between gap-2">
          {moods.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => setFormData({...formData, mood: m.emoji})}
              className={`flex-1 py-2 text-2xl rounded-xl border-2 transition-all ${
                formData.mood === m.emoji 
                ? 'bg-yellow-300 border-black scale-110 shadow-[3px_3px_0_0_#000]' 
                : 'bg-white border-transparent opacity-40 hover:opacity-100'
              }`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      <input 
        type="text" 
        placeholder="Topik Pembelajaran" 
        className="w-full p-4 rounded-xl border-2 border-black font-bold text-black focus:bg-indigo-50 outline-none transition-colors" 
        value={formData.topic} 
        onChange={(e) => setFormData({...formData, topic: e.target.value})} 
      />
      
      <textarea 
        placeholder="Apa yang dipelajari?" 
        className="w-full p-4 h-24 rounded-xl border-2 border-black font-medium text-black focus:bg-indigo-50 outline-none transition-colors" 
        value={formData.learned} 
        onChange={(e) => setFormData({...formData, learned: e.target.value})} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea 
          placeholder="Tantangan terbesar?" 
          className="w-full p-4 h-20 rounded-xl border-2 border-black font-medium text-black focus:bg-indigo-50 outline-none transition-colors text-sm" 
          value={formData.challenging} 
          onChange={(e) => setFormData({...formData, challenging: e.target.value})} 
        />
        <textarea 
          placeholder="Rencana penerapan?" 
          className="w-full p-4 h-20 rounded-xl border-2 border-black font-medium text-black focus:bg-indigo-50 outline-none transition-colors text-sm" 
          value={formData.application} 
          onChange={(e) => setFormData({...formData, application: e.target.value})} 
        />
      </div>

      <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] border-2 border-black font-black uppercase italic shadow-[6px_6px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-lg">
        Simpan Refleksi 🚀
      </button>
    </form>
  );
}

// --- BAGIAN 3: KOMPONEN LIST ---
function JournalList({ entries, onDelete }: { entries: JournalEntry[], onDelete: (id: string) => void }) {
  if (entries.length === 0) return (
    <div className="text-center py-20 bg-slate-100 rounded-[2.5rem] border-4 border-dashed border-slate-300 font-black text-slate-400">
      <div className="text-5xl mb-4">📖</div>
      <p className="uppercase tracking-widest">Jurnal masih kosong</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white border-4 border-black p-6 md:p-8 rounded-[2.5rem] shadow-[10px_10px_0_0_#000] relative group hover:-translate-y-1 transition-all">
          {/* Mood Badge */}
          <div className="absolute -top-4 -right-2 bg-white border-2 border-black p-2 rounded-xl text-2xl shadow-[4px_4px_0_0_#000] z-10">
            {entry.mood || '😊'}
          </div>

          <button 
            onClick={() => onDelete(entry.id)} 
            className="absolute top-6 right-12 text-slate-300 hover:text-red-500 transition-colors p-2"
          >
            <Trash2 size={20} />
          </button>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-yellow-300 px-4 py-1.5 rounded-full text-[10px] font-black border-2 border-black uppercase shadow-[3px_3px_0_0_#000] flex items-center gap-1">
              <Hash size={12} /> {entry.topic}
            </span>
            <span className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black border-2 border-slate-200 text-slate-500 uppercase flex items-center gap-1">
              <Calendar size={12} /> {entry.date}
            </span>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-3xl border-2 border-indigo-100 mb-6 relative">
            <div className="absolute -top-3 -left-2 bg-indigo-600 text-white p-1 rounded-lg">
               <Quote size={14} fill="currentColor" />
            </div>
            <p className="text-base font-bold text-slate-700 leading-relaxed italic">
              "{entry.learned}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50/50 rounded-2xl border-2 border-orange-100"> 
              <span className="text-[10px] font-black uppercase text-orange-600 block mb-1">⚠️ Tantangan:</span> 
              <p className="text-xs font-bold text-slate-600">{entry.challenging || '-'}</p> 
            </div>
            <div className="p-4 bg-green-50/50 rounded-2xl border-2 border-green-100"> 
              <span className="text-[10px] font-black uppercase text-green-600 block mb-1">💡 Penerapan:</span> 
              <p className="text-xs font-bold text-slate-600">{entry.application || '-'}</p> 
            </div>
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
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading journals", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveEntry = (dataForm: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = { 
      ...dataForm, 
      id: Date.now().toString(), 
      date: new Date().toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'long', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }) 
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('bioscope_journals', JSON.stringify(updated));
  };

  const deleteEntry = (id: string) => {
    if (confirm("Hapus catatan jurnal ini?")) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      localStorage.setItem('bioscope_journals', JSON.stringify(updated));
    }
  };

  const filteredEntries = entries.filter(e => 
    e.topic.toLowerCase().includes(filter.toLowerCase())
  );

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <button 
          onClick={() => router.push('/dashboard')} 
          className="flex items-center gap-2 font-black uppercase text-xs bg-white border-4 border-black px-6 py-3 rounded-full shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </button>

        <div className="bg-white p-8 md:p-12 rounded-[3rem] border-4 border-black shadow-[10px_10px_0_0_#000] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">
              Learning Journal
            </h1>
            <p className="text-slate-500 font-bold text-lg flex items-center justify-center md:justify-start gap-2">
              <Sparkles size={20} className="text-yellow-500" /> Pantau perkembangan belajarmu secara mendalam.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0_0_#000] text-center min-w-[140px]">
            <p className="text-[10px] font-black uppercase text-indigo-600 mb-1">Total Refleksi</p>
            <p className="text-5xl font-black italic">{entries.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-8"> 
            <JournalForm onSave={saveEntry} /> 
          </div>
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0_0_#4f46e5]">
              <BookText className="text-indigo-600" size={28} />
              <input 
                type="text" 
                placeholder="Cari berdasarkan topik..." 
                className="flex-1 outline-none font-bold bg-transparent text-xl text-black placeholder:text-slate-300" 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
              />
            </div>
            <JournalList entries={filteredEntries} onDelete={deleteEntry} />
          </div>
        </div>
      </div>
      
      {/* Footer Info Lomba */}
      <div className="max-w-6xl mx-auto mt-20 mb-10 text-center">
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
          Bioscope Web • Innovative Education Tool 2026
        </p>
      </div>
    </div>
  );
}