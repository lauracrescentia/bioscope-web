"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleMenuClick = (name: string) => {
    // Navigasi berdasarkan nama menu (Mendukung ID & EN)
    
    // 1. Materi
    if (name === 'Materi' || name === 'Materials') {
      router.push('/materi');
    } 
    // 2. Permainan / Games
    else if (name === 'Permainan' || name === 'Games') {
      router.push('/games');
    } 
    // 3. Ujian / Test (Logika Guru vs Siswa)
    else if (name === 'Ujian' || name === 'Test') {
      if (user?.role === 'teacher') {
        router.push('/test'); 
      } else {
        router.push('/test/run'); 
      }
    }
    // 4. Laporan / Reports
    else if (name === 'Laporan' || name === 'Reports') {
      router.push('/reports');
    }
    // 5. Perpustakaan / Library (Koleksi Soal & Aktivitas)
    else if (name === 'Perpustakaan' || name === 'Library') {
      router.push('/test'); 
    }
    // 6. Lab Virtual
    else if (name === 'Lab Virtual' || name === 'Virtual Lab') {
      router.push('/virtual-lab');
    }
    // 7. Beranda
    else if (name === 'Beranda' || name === 'Home') {
      setIsSidebarOpen(false);
    }
  };

  const t = {
    id: {
      slogan: "Jelajahi keajaiban kehidupan dan temukan rahasia biologi di ujung jari Anda.",
      menuTitle: "Menu Utama",
      logout: "Keluar",
      placeholder: "Masukkan kode akses (Contoh: BIO-123)",
      joinBtn: "Gabung Kelas",
      items: [
        { name: 'Beranda', icon: '🏠' },
        { name: 'Materi', icon: '📚' },
        { name: 'Permainan', icon: '🎮' },
        { name: 'Lab Virtual', icon: '🧪' },
        { name: 'Ujian', icon: '📝' },
        { name: 'Perpustakaan', icon: '📖' },
        { name: 'Laporan', icon: '📊' },
      ]
    },
    en: {
      slogan: "Explore the wonders of life and discover biology's secrets at your fingertips.",
      menuTitle: "Main Menu",
      logout: "Logout",
      placeholder: "Enter access code (e.g., BIO-123)",
      joinBtn: "Join Class",
      items: [
        { name: 'Home', icon: '🏠' },
        { name: 'Materials', icon: '📚' },
        { name: 'Games', icon: '🎮' },
        { name: 'Virtual Lab', icon: '🧪' },
        { name: 'Test', icon: '📝' },
        { name: 'Library', icon: '📖' },
        { name: 'Reports', icon: '📊' },
      ]
    }
  }[lang];

  if (!user) return <div className="p-10 text-black text-center font-bold">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 text-black font-sans flex">
      
      {/* --- SIDEBAR --- */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-slate-100`}>
        <div className="p-6 border-b flex justify-between items-center">
          <span className="font-bold text-xl text-green-600 tracking-tight">{t.menuTitle}</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-2xl">&times;</button>
        </div>
        <nav className="p-4 space-y-2">
          {t.items.map((item) => (
            <button 
              key={item.name} 
              onClick={() => handleMenuClick(item.name)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all font-medium text-slate-600"
            >
              <span className="text-xl">{item.icon}</span> {item.name}
            </button>
          ))}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl bg-red-50 text-red-500 transition-all font-bold mt-10 hover:bg-red-100"
          >
            <span>🚪</span> {t.logout}
          </button>
        </nav>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="flex-1 flex flex-col relative overflow-y-auto h-screen">
        
        {/* Top Bar: Toggle & Language */}
        <div className="p-4 flex justify-between items-center absolute w-full top-0 left-0 z-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-3xl bg-white p-2 rounded-xl shadow-sm">☰</button>
          
          <div className="ml-auto flex gap-2">
            <button onClick={() => setLang('id')} className={`px-4 py-1 rounded-lg font-bold transition shadow-sm ${lang === 'id' ? 'bg-green-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>ID</button>
            <button onClick={() => setLang('en')} className={`px-4 py-1 rounded-lg font-bold transition shadow-sm ${lang === 'en' ? 'bg-green-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>EN</button>
          </div>
        </div>

        {/* 1. HEADER TENGAH */}
        <header className="flex flex-col items-center justify-center pt-20 pb-8 px-4 text-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} className="mb-6 drop-shadow-md" />
          <h1 className="text-5xl font-black italic mb-2 tracking-tighter">
            <span className="text-green-600">BIO</span><span className="text-sky-400">scope</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium italic max-w-xl">
            "{t.slogan}"
          </p>
        </header>

        {/* 2. KOLOM ENTER CODE */}
        <section className="flex flex-col items-center px-4 mb-12">
          <div className="w-full max-w-lg bg-white p-2 rounded-[2rem] shadow-xl shadow-green-100/50 flex flex-col md:flex-row gap-2 border border-green-100">
            <input 
              type="text" 
              placeholder={t.placeholder}
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              className="flex-1 p-4 rounded-[1.5rem] bg-slate-50 outline-none text-center font-bold text-lg focus:bg-white transition-all uppercase placeholder:normal-case placeholder:font-normal"
            />
            <button className="bg-green-600 text-white px-8 py-4 rounded-[1.5rem] font-bold hover:bg-green-700 transition-all active:scale-95 shadow-md">
              {t.joinBtn}
            </button>
          </div>
        </section>

        {/* 3. GRID MENU (Body Dashboard) */}
        <div className="p-8 max-w-6xl mx-auto w-full pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {t.items.map((item) => (
              <div 
                key={item.name} 
                onClick={() => handleMenuClick(item.name)}
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className="font-bold text-slate-700 text-center">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}