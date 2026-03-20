"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// --- IMPORT IKON ---
import { 
  BookOpen, 
  Gamepad2, 
  FlaskConical, 
  Box, 
  FileText, 
  Trophy, 
  Library, 
  BarChart3, 
  User, 
  Settings,
  LogOut,
  Languages,
  Menu,
  X,
  Grid // Ikon Grid untuk Menu Utama
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [accessCode, setAccessCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.href = '/';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleJoinCode = () => {
    const code = accessCode.toUpperCase();
    if (!code) return alert(lang === 'id' ? "Masukkan kode dulu!" : "Enter code first!");

    if (code.startsWith('GAME')) router.push(`/games?code=${code}`);
    else if (code.startsWith('QUIZ')) router.push(`/quiz?code=${code}`);
    else if (code.startsWith('TEST')) router.push(`/test/run?code=${code}`);
    else {
      alert(lang === 'id' 
        ? "Kode tidak dikenali. Gunakan awalan GAME-, QUIZ-, atau TEST-" 
        : "Invalid code. Use prefix GAME-, QUIZ-, or TEST-");
    }
  };

  const handleMenuClick = (name: string) => {
    const n = name.toLowerCase();
    if (n === 'materi' || n === 'materials') router.push('/materi');
    else if (n === 'permainan' || n === 'games') router.push('/games');
    else if (n === 'lab virtual' || n === 'virtual lab') router.push('/virtual-lab');
    else if (n === 'augmented reality' || n === 'ar') router.push('/ar'); 
    else if (n === 'ujian' || n === 'test') router.push(user?.role === 'teacher' ? '/test' : '/test/run');
    else if (n === 'kuis' || n === 'quiz') router.push('/quiz');
    else if (n === 'perpustakaan' || n === 'library') router.push('/library');
    else if (n === 'laporan' || n === 'reports') router.push('/reports');
    else if (n === 'profil' || n === 'profile') router.push('/profile');
    else if (n === 'pengaturan' || n === 'settings') router.push('/settings');
  };

  const t = {
    id: {
      slogan: "Discover the Fascinating World of Biology",
      menuTitle: "BIOscope Menu",
      logout: "Keluar",
      placeholder: "Contoh: GAME-123, QUIZ-BIO",
      joinBtn: "Join",
      profileMenus: ["Ganti Foto", "Ubah Username"],
      items: [
        { name: 'Materi', icon: <BookOpen size={24} /> },
        { name: 'Permainan', icon: <Gamepad2 size={24} /> },
        { name: 'Lab Virtual', icon: <FlaskConical size={24} /> },
        { name: 'Augmented Reality', icon: <Box size={24} /> },
        { name: 'Ujian', icon: <FileText size={24} /> },
        { name: 'Kuis', icon: <Trophy size={24} /> },
        { name: 'Perpustakaan', icon: <Library size={24} /> },
        { name: 'Laporan', icon: <BarChart3 size={24} /> },
        { name: 'Profil', icon: <User size={24} /> },
        { name: 'Pengaturan', icon: <Settings size={24} /> },
      ]
    },
    en: {
      slogan: "Discover the Fascinating World of Biology",
      menuTitle: "BIOscope Menu",
      logout: "Quit",
      placeholder: "e.g., GAME-123, QUIZ-BIO",
      joinBtn: "Join",
      profileMenus: ["Change Photo", "Change Username"],
      items: [
        { name: 'Materials', icon: <BookOpen size={24} /> },
        { name: 'Games', icon: <Gamepad2 size={24} /> },
        { name: 'Virtual Lab', icon: <FlaskConical size={24} /> },
        { name: 'AR', icon: <Box size={24} /> },
        { name: 'Test', icon: <FileText size={24} /> },
        { name: 'Quiz', icon: <Trophy size={24} /> },
        { name: 'Library', icon: <Library size={24} /> },
        { name: 'Reports', icon: <BarChart3 size={24} /> },
        { name: 'Profile', icon: <User size={24} /> },
        { name: 'Settings', icon: <Settings size={24} /> },
      ]
    }
  }[lang];

  if (!user) return <div className="p-10 text-black text-center font-bold">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 text-black font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out border-r`}>
        <div className="p-6 border-b flex justify-between items-center bg-green-600 text-white">
          <div className="flex items-center gap-2">
             <Grid size={20} />
             <span className="font-bold text-xl tracking-tight">BIOscope</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="hover:bg-green-700 p-1 rounded-lg transition">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-150px)]">
          {t.items.map((item) => (
            <button 
              key={item.name} 
              onClick={() => handleMenuClick(item.name)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all font-medium text-slate-600 text-sm text-left group"
            >
              <span className="text-slate-400 group-hover:text-green-600 transition-colors">{item.icon}</span> {item.name}
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-500 font-bold mt-4 hover:bg-red-50 text-left">
            <LogOut size={20} /> {t.logout}
          </button>
        </nav>
      </div>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* TOP BAR */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b p-3 flex justify-between items-center px-6">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-full border text-[10px] font-bold">
              <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-full transition ${lang === 'id' ? 'bg-green-600 text-white shadow-sm' : 'text-slate-400'}`}>INDONESIA</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full transition ${lang === 'en' ? 'bg-green-600 text-white shadow-sm' : 'text-slate-400'}`}>ENGLISH</button>
            </div>
            
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full border transition">
                <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}`} alt="Avatar" className="w-8 h-8 rounded-full shadow-sm" />
                <span className="text-xs font-bold hidden sm:block">{user?.name} ▾</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border p-2 z-50">
                  {t.profileMenus.map(m => (
                    <button key={m} className="w-full text-left p-3 text-xs font-medium hover:bg-slate-50 rounded-xl transition">{m}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <header className="flex flex-col items-center justify-center pt-12 pb-10 px-4 text-center">
          <Image src="/logo.png" alt="Logo" width={180} height={180} className="mb-4 mix-blend-multiply" priority />
          <p className="text-slate-500 text-lg md:text-xl font-medium italic">"{t.slogan}"</p>
        </header>

        <section className="px-6 mb-10 flex justify-center">
          <div className="w-full max-w-md bg-white p-2 rounded-2xl shadow-lg flex gap-2 border border-slate-100">
             <input 
              type="text" 
              placeholder={t.placeholder}
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              className="flex-1 p-3 bg-slate-50 rounded-xl outline-none text-center font-bold placeholder:font-normal placeholder:text-sm text-black"
            />
            <button onClick={handleJoinCode} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md active:scale-95">JOIN</button>
          </div>
        </section>

        <div className="px-6 max-w-6xl mx-auto w-full pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {t.items.map((item) => (
              <div 
                key={item.name} 
                onClick={() => handleMenuClick(item.name)}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group text-center"
              >
                <div className="text-green-600 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="font-bold text-slate-700 text-sm md:text-base">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(isProfileOpen || isSidebarOpen) && (
        <div onClick={() => {setIsProfileOpen(false); setIsSidebarOpen(false)}} className="fixed inset-0 z-30 bg-black/10" />
      )}
    </main>
  );
}