"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  
  // States
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Load data dari LocalStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as 'id' | 'en';
    const savedEmail = localStorage.getItem('user_email');
    if (savedLang) setLang(savedLang);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSave = () => {
    localStorage.setItem('app_lang', lang);
    localStorage.setItem('user_email', email);
    
    const msg = lang === 'id' 
      ? "Pengaturan Berhasil Disimpan! ⚙️" 
      : "Settings Saved Successfully! ⚙️";
    alert(msg);
  };

  // Kamus Bahasa Sederhana
  const t = {
    id: {
      title: "Pengaturan",
      acc: "Keamanan Akun",
      email: "Alamat Email",
      pass: "Kata Sandi Baru",
      hint: "Kosongkan jika tidak ingin diubah",
      langTitle: "Pilih Bahasa",
      save: "Simpan Perubahan",
      back: "Kembali"
    },
    en: {
      title: "Settings",
      acc: "Account Security",
      email: "Email Address",
      pass: "New Password",
      hint: "Leave blank if no change",
      langTitle: "Select Language",
      save: "Save Changes",
      back: "Back"
    }
  }[lang];

  return (
    <main className="min-h-screen bg-[#F0F4F8] p-6 font-sans flex items-center justify-center text-[#0f172a]">
      <div className="w-full max-w-2xl bg-white border-4 border-black rounded-[3rem] shadow-[12px_12px_0_0_#000] p-8 md:p-12 relative overflow-hidden">
        
        {/* Dekorasi Aksesoris */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500 rounded-full border-4 border-black -z-0"></div>

        <div className="relative z-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-10 border-b-4 border-black pb-4">
            {t.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* BAGIAN AKUN */}
            <div className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600">{t.acc}</h2>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-50 ml-2">{t.email}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bioscope.id"
                  className="w-full p-4 border-4 border-black rounded-2xl font-bold outline-none focus:bg-indigo-50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-50 ml-2">{t.pass}</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 border-4 border-black rounded-2xl font-bold outline-none focus:bg-indigo-50 transition-colors"
                />
                <p className="text-[9px] font-bold text-slate-400 italic ml-2">{t.hint}</p>
              </div>
            </div>

            {/* BAGIAN BAHASA */}
            <div className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-500">{t.langTitle}</h2>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setLang('id')}
                  className={`p-5 rounded-2xl border-4 border-black font-black flex justify-between items-center transition-all
                    ${lang === 'id' ? 'bg-yellow-400 shadow-[4px_4px_0_0_#000] translate-x-[-2px] translate-y-[-2px]' : 'bg-slate-50 opacity-50'}`}
                >
                  BAHASA INDONESIA 🇮🇩
                </button>

                <button 
                  onClick={() => setLang('en')}
                  className={`p-5 rounded-2xl border-4 border-black font-black flex justify-between items-center transition-all
                    ${lang === 'en' ? 'bg-indigo-500 text-white shadow-[4px_4px_0_0_#000] translate-x-[-2px] translate-y-[-2px]' : 'bg-slate-50 opacity-50'}`}
                >
                  ENGLISH 🇺🇸
                </button>
              </div>
            </div>
          </div>

          {/* TOMBOL AKSI */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t-4 border-black pt-8">
            <button 
              onClick={() => router.back()}
              className="font-black uppercase text-sm underline decoration-4 underline-offset-4 hover:text-indigo-600 transition-colors"
            >
              ← {t.back}
            </button>

            <button 
              onClick={handleSave}
              className="w-full md:w-auto px-10 py-5 bg-black text-white rounded-2xl font-black text-xl shadow-[6px_6px_0_0_#FACC15] hover:translate-y-1 hover:shadow-none transition-all uppercase italic"
            >
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}