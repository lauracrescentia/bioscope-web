"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Load data saat pertama kali buka
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setUsername(parsedUser.name || '');
      setProfilePic(parsedUser.photo || null);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran file (Opsional: LocalStorage punya limit 5MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran foto terlalu besar! Maksimal 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      // AMBIL data lama, UPDATE field yang baru
      const updatedUser = {
        ...userData,
        name: username,
        photo: profilePic
      };

      // SIMPAN ke key 'user' (agar sinkron dengan Dashboard)
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsSaving(false);
      alert("Profil berhasil diperbarui! 🚀");
      
      // Opsional: Kembali ke dashboard setelah simpan
      router.push('/dashboard'); 
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#F0F4F8] p-4 md:p-8 font-sans text-[#0F172A] flex justify-center items-center">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-[2.5rem] shadow-[8px_8px_0_0_#000] p-8 relative overflow-hidden">
        
        {/* Dekorasi Latar */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400 rounded-full border-4 border-black -z-0"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* PERBAIKAN: Judul diperkecil (text-2xl) */}
          <h1 className="text-2xl font-black italic uppercase tracking-tight mb-6 text-center border-b-4 border-black pb-1">
            Edit Profil
          </h1>

          {/* Bagian Foto Profil */}
          <div className="relative group mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-slate-200 shadow-[4px_4px_0_0_#6366F1]">
              {profilePic ? (
                <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-100">👤</div>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 bg-[#FACC15] border-2 border-black p-2 rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-[3px_3px_0_0_#000]">
              <span className="text-lg">📸</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Input Username */}
          <div className="w-full space-y-2 mb-8">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-slate-500">Nama Pengguna</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-black rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              placeholder="Masukkan nama..."
            />
          </div>

          {/* Tombol Aksi */}
          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-4 rounded-xl font-black text-lg border-4 border-black shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all uppercase italic
                ${isSaving ? 'bg-slate-200 cursor-not-allowed text-slate-500' : 'bg-[#6366F1] text-white hover:bg-indigo-600'}`}
            >
              {isSaving ? 'Proses...' : 'Simpan Profil 💾'}
            </button>

            <button 
              onClick={() => router.back()}
              className="text-xs font-black uppercase underline decoration-2 underline-offset-4 text-slate-400 hover:text-black transition-colors"
            >
              Batal & Kembali
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}