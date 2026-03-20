"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState('Admin Bioscope');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load data saat pertama kali buka
  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    const savedPic = localStorage.getItem('user_avatar');
    if (savedName) setUsername(savedName);
    if (savedPic) setProfilePic(savedPic);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulasi loading sebentar agar terasa real
    setTimeout(() => {
      localStorage.setItem('user_name', username);
      if (profilePic) localStorage.setItem('user_avatar', profilePic);
      setIsSaving(false);
      alert("Profil berhasil diperbarui! 🚀");
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#F0F4F8] p-8 font-sans text-[#0F172A] flex justify-center items-center">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-[3rem] shadow-[12px_12px_0_0_#000] p-10 relative overflow-hidden">
        
        {/* Dekorasi Latar */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full border-4 border-black -z-0"></div>

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Edit Profil</h1>

          {/* Bagian Foto Profil */}
          <div className="relative group mb-8">
            <div className="w-40 h-40 rounded-full border-8 border-black overflow-hidden bg-slate-200 shadow-[6px_6px_0_0_#6366F1]">
              {profilePic ? (
                <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">👤</div>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 bg-[#FACC15] border-4 border-black p-3 rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-[4px_4px_0_0_#000]">
              <span className="text-xl">📸</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Input Username */}
          <div className="w-full space-y-2 mb-10">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-slate-400">Username Kamu</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-5 bg-slate-50 border-4 border-black rounded-2xl text-xl font-black outline-none focus:border-indigo-500 transition-colors"
              placeholder="Ketik username..."
            />
          </div>

          {/* Tombol Aksi */}
          <div className="w-full flex flex-col gap-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-5 rounded-2xl font-black text-xl border-4 border-black shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-1 transition-all uppercase italic
                ${isSaving ? 'bg-slate-200 cursor-not-allowed' : 'bg-[#6366F1] text-black hover:bg-indigo-500'}`}
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan 💾'}
            </button>

            <button 
              onClick={() => router.back()}
              className="text-sm font-black uppercase underline decoration-2 underline-offset-4 text-slate-400 hover:text-black"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}