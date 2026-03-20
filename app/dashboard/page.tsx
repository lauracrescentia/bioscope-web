"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [lang, setLang] = useState<'id' | 'en'>('id'); // Default awal
  const [accessCode, setAccessCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil data User
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.href = '/';
    }

    // 2. Ambil bahasa yang tersimpan agar PERMANEN
    const savedLang = localStorage.getItem('app_lang') as 'id' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  // Fungsi simpan bahasa ke localStorage
  const changeLanguage = (newLang: 'id' | 'en') => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

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
      welcome: "Selamat Datang,",
      slogan: "Discover the Fascinating World of Biology",
      logout: "Keluar",
      placeholder: "Contoh: GAME-123, QUIZ-BIO",
      joinBtn: "Join",
      profileMenus: ["Ganti Foto", "Ubah Username"],
      items: [
        { name: 'Materi', icon: '📚' },
        { name: 'Permainan', icon: '🎮' },
        { name: 'Lab Virtual', icon: '🧪' },
        { name: 'Augmented Reality', icon: '🕶️' },
        { name: 'Ujian', icon: '📝' },
        { name: 'Kuis', icon: '🏆' },
        { name: 'Perpustakaan', icon: '📖' },
        { name: 'Laporan', icon: '📊' },
        { name: 'Profil', icon: '👤' },
        { name: 'Pengaturan', icon: '⚙️' },
      ]
    },
    en: {
      welcome: "Welcome back,",
      slogan: "Discover the Fascinating World of Biology",
      logout: "Quit",
      placeholder: "e.g., GAME-123, QUIZ-BIO",
      joinBtn: "Join",
      profileMenus: ["Change Photo", "Change Username"],
      items: [
        { name: 'Materials', icon: '📚' },
        { name: 'Games', icon: '🎮' },
        { name: 'Virtual Lab', icon: '🧪' },
        { name: 'AR', icon: '🕶️' },
        { name: 'Test', icon: '📝' },
        { name: 'Quiz', icon: '🏆' },
        { name: 'Library', icon: '📖' },
        { name: 'Reports', icon: '📊' },
        { name: 'Profile', icon: '👤' },
        { name: 'Settings', icon: '⚙️' },
      ]
    }
  }[lang];

  if (!user) return <div className="p-10 text-black text-center font-bold">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 text-black font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out border-r`}>
        <div className="p-6 border-b flex justify-between items-center bg-green-600 text-white">
          <div className="flex items-center gap-3">
             <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} className="w-10 h-10 rounded-full border-2 border-white shadow-md" alt="User" />
             <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight leading-none">{user?.name}</span>
                <span className="text-[10px] opacity-80 uppercase">{user?.role || 'Student'}</span>
             </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-2xl hover:rotate-90 transition-transform">&times;</button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-150px)]">
          {t.items.map((item) => (
            <button 
              key={item.name} 
              onClick={() => handleMenuClick(item.name)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all font-medium text-slate-600 text-sm text-left"
            >
              <span className="text-xl">{item.icon}</span> {item.name}
            </button>
          ))}
          <button onClick={handleLogout} className="w-full p-3 rounded-xl text-red-500 font-bold mt-4 hover:bg-red-50 text-left">
            {t.logout}
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* TOP BAR */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b p-3 flex justify-between items-center px-6">
          <button onClick={() => setIsSidebarOpen(true)} className="text-2xl p-2 hover:bg-slate-100 rounded-lg">☰</button>
          
          <div className="flex items-center gap-4">
            {/* Language Switcher with Persistence */}
            <div className="flex bg-slate-100 p-1 rounded-full border text-[10px] font-bold">
              <button onClick={() => changeLanguage('id')} className={`px-3 py-1 rounded-full transition ${lang === 'id' ? 'bg-green-600 text-white shadow-sm' : 'text-slate-400'}`}>ID</button>
              <button onClick={() => changeLanguage('en')} className={`px-3 py-1 rounded-full transition ${lang === 'en' ? 'bg-green-600 text-white shadow-sm' : 'text-slate-400'}`}>EN</button>
            </div>
            
            {/* User Profile Info */}
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full border transition-all active:scale-95">
                <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Avatar" className="w-8 h-8 rounded-full shadow-sm object-cover" />
                <div className="text-left leading-tight hidden sm:block">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t.welcome}</p>
                    <p className="text-xs font-black text-slate-800">{user?.name} ▾</p>
                </div>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border p-2 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="p-3 mb-2 border-b text-center sm:hidden">
                     <p className="font-bold text-xs">{user?.name}</p>
                  </div>
                  {t.profileMenus.map(m => (
                    <button key={m} className="w-full text-left p-3 text-xs font-medium hover:bg-slate-50 rounded-xl transition">{m}</button>
                  ))}
                  <button onClick={handleLogout} className="w-full text-left p-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition border-t mt-1">{t.logout}</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <header className="flex flex-col items-center justify-center pt-12 pb-10 px-4 text-center">
          <Image src="/logo.png" alt="Logo" width={180} height={180} className="mb-4 mix-blend-multiply" priority />
          <p className="text-slate-500 text-lg md:text-xl font-medium italic">"{t.slogan}"</p>
        </header>

        {/* INPUT CODE */}
        <section className="px-6 mb-10 flex justify-center">
          <div className="w-full max-w-md bg-white p-2 rounded-2xl shadow-lg flex gap-2 border border-slate-100">
             <input 
              type="text" 
              placeholder={t.placeholder}
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              className="flex-1 p-3 bg-slate-50 rounded-xl outline-none text-center font-bold placeholder:font-normal placeholder:text-sm text-black"
            />
            <button onClick={handleJoinCode} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md active:scale-95">{t.joinBtn}</button>
          </div>
        </section>

        {/* MENU GRID */}
        <div className="px-6 max-w-6xl mx-auto w-full pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {t.items.map((item) => (
              <div 
                key={item.name} 
                onClick={() => handleMenuClick(item.name)}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group text-center"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className="font-bold text-slate-700 text-sm md:text-base">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(isProfileOpen || isSidebarOpen) && (
        <div onClick={() => {setIsProfileOpen(false); setIsSidebarOpen(false)}} className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[2px]" />
      )}
    </main>
  );
}