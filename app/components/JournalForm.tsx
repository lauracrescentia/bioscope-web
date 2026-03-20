"use client";
import { useState } from 'react';

export default function JournalForm({ onSave }: { onSave: (entry: any) => void }) {
  const [formData, setFormData] = useState({
    topic: '',
    learned: '',
    challenging: '',
    application: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic || !formData.learned) return alert("Isi topik dan apa yang kamu pelajari!");
    onSave(formData);
    setFormData({ topic: '', learned: '', challenging: '', application: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-6 rounded-[2rem] shadow-[8px_8px_0_0_#6366f1] space-y-4 sticky top-8">
      <h3 className="font-black uppercase text-xl mb-4 italic text-indigo-600">Tulis Jurnal Baru</h3>
      
      <div>
        <label className="block text-[10px] font-black uppercase mb-1">Topik Pembelajaran</label>
        <input 
          type="text" 
          placeholder="Contoh: Sistem Peredaran Darah"
          className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-black outline-none font-bold transition-all"
          value={formData.topic}
          onChange={(e) => setFormData({...formData, topic: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase mb-1">Apa yang kamu pelajari hari ini?</label>
        <textarea 
          className="w-full p-3 h-24 rounded-xl border-2 border-slate-200 focus:border-black outline-none font-medium text-sm resize-none"
          value={formData.learned}
          onChange={(e) => setFormData({...formData, learned: e.target.value})}
        ></textarea>
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase mb-1">Bagian mana yang paling menantang?</label>
        <textarea 
          className="w-full p-3 h-20 rounded-xl border-2 border-slate-200 focus:border-black outline-none font-medium text-sm resize-none"
          value={formData.challenging}
          onChange={(e) => setFormData({...formData, challenging: e.target.value})}
        ></textarea>
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase mb-1">Bagaimana kamu menerapkannya di dunia nyata?</label>
        <textarea 
          className="w-full p-3 h-20 rounded-xl border-2 border-slate-200 focus:border-black outline-none font-medium text-sm resize-none"
          value={formData.application}
          onChange={(e) => setFormData({...formData, application: e.target.value})}
        ></textarea>
      </div>

      <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase italic shadow-[4px_4px_0_0_#312e81] active:translate-y-1 active:shadow-none transition-all">
        Simpan Refleksi 🚀
      </button>
    </form>
  );
}