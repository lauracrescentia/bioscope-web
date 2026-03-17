"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestLibrary() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tests' | 'activity'>('tests');
  const [tests, setTests] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [activeTest, setActiveTest] = useState<any>(null);
  const [isLive, setIsLive] = useState(false);

  // 1. Ambil data dari library & activity saat halaman dibuka
  useEffect(() => {
    const library = JSON.parse(localStorage.getItem('test_library') || '[]');
    setTests(library);

    const savedActivity = JSON.parse(localStorage.getItem('test_activity') || '[]');
    setActivities(savedActivity);
  }, []);

  // 2. Fungsi untuk mengaktifkan mode Host
  const handleHostLive = (test: any) => {
    setActiveTest(test);
    setIsLive(false);
    localStorage.removeItem(`live_status_${test.id}`);
  };

  // 3. Fungsi untuk memulai Test
  const handleStartTest = () => {
    if (!activeTest) return;
    setIsLive(true);
    localStorage.setItem(`live_status_${activeTest.id}`, 'STARTED');

    // Tambahkan ke Activity secara otomatis saat test dimulai
    const newActivity = {
      testId: activeTest.id,
      testName: activeTest.name,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'In Progress',
      participantCount: Math.floor(Math.random() * 30) + 1 // Simulasi jumlah siswa
    };
    const updatedActivity = [newActivity, ...activities];
    setActivities(updatedActivity);
    localStorage.setItem('test_activity', JSON.stringify(updatedActivity));
  };

  // 4. Fungsi hapus test
  const deleteTest = (id: string) => {
    if (confirm("Hapus soal ini dari library?")) {
      const updated = tests.filter(t => t.id !== id);
      setTests(updated);
      localStorage.setItem('test_library', JSON.stringify(updated));
      if (activeTest?.id === id) setActiveTest(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter">My Library 🗄️</h1>
            <p className="text-slate-500 font-medium">Koleksi soal dan riwayat aktivitas ujian Anda.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold hover:bg-slate-100 transition"
            >
              Back
            </button>
            <button 
              onClick={() => router.push('/test/create')}
              className="bg-sky-500 text-black px-8 py-3 rounded-2xl font-black shadow-[0_6px_0_#0369a1] hover:translate-y-1 hover:shadow-[0_3px_0_#0369a1] active:translate-y-2 active:shadow-none transition-all"
            >
              + CREATE NEW ITEM
            </button>
          </div>
        </header>

        {/* --- TAB SWITCHER --- */}
        <div className="flex gap-4 mb-10 bg-slate-200/50 p-2 rounded-[2rem] w-fit">
          <button 
            onClick={() => setActiveTab('tests')}
            className={`px-8 py-3 rounded-[1.5rem] font-black transition-all ${activeTab === 'tests' ? 'bg-white shadow-md text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            MY TESTS ({tests.length})
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`px-8 py-3 rounded-[1.5rem] font-black transition-all ${activeTab === 'activity' ? 'bg-white shadow-md text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ACTIVITY ({activities.length})
          </button>
        </div>

        {/* --- LIVE CONTROL CENTER --- */}
        {activeTest && activeTab === 'tests' && (
          <div className="mb-12 bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-4 border-sky-500 animate-in zoom-in duration-300">
            <div className="text-center md:text-left">
              <p className="text-sky-400 font-black text-xs uppercase tracking-widest mb-1">Live Control Center</p>
              <h2 className="text-3xl font-black">{activeTest.name}</h2>
              <p className="text-slate-400">Status: {isLive ? 'Ujian sedang berlangsung' : 'Menunggu siswa bergabung...'}</p>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="text-center px-6 border-r border-slate-700">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Join Code</p>
                <p className="text-4xl font-mono font-black text-sky-400">{activeTest.id}</p>
              </div>
              
              {!isLive ? (
                <button 
                  onClick={handleStartTest}
                  className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all animate-bounce"
                >
                  🚀 START TEST
                </button>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-red-500/20 text-red-500 px-6 py-3 rounded-xl font-black border border-red-500/50 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    TEST IN PROGRESS
                  </div>
                  <button onClick={() => setActiveTest(null)} className="text-xs text-slate-500 mt-2 underline">End Session</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- CONTENT AREA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'tests' ? (
            /* Tab: Koleksi Soal */
            tests.length === 0 ? (
              <EmptyState message="Belum ada soal di library." />
            ) : (
              tests.map((test) => (
                <div 
                  key={test.id} 
                  className={`bg-white p-8 rounded-[3rem] shadow-sm border transition-all ${activeTest?.id === test.id ? 'border-sky-500 ring-4 ring-sky-100' : 'border-slate-100 hover:shadow-xl'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-sky-100 text-sky-600 px-3 py-1 rounded-lg font-mono text-xs font-bold">{test.id}</span>
                    <button onClick={() => deleteTest(test.id)} className="text-slate-300 hover:text-red-500 transition">🗑️</button>
                  </div>
                  <h3 className="text-xl font-black text-slate-700 mb-2 truncate">{test.name}</h3>
                  <div className="flex gap-2 mb-8">
                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-slate-500 uppercase">⏱️ {test.duration} Min</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-slate-500 uppercase">📝 {test.questions.length} Items</span>
                  </div>
                  <button 
                    onClick={() => handleHostLive(test)}
                    disabled={activeTest?.id === test.id}
                    className={`w-full py-4 rounded-2xl font-black transition-all ${activeTest?.id === test.id ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-black text-white hover:bg-slate-800 shadow-lg'}`}
                  >
                    {activeTest?.id === test.id ? 'CURRENTLY HOSTING' : 'HOST LIVE'}
                  </button>
                </div>
              ))
            )
          ) : (
            /* Tab: Riwayat Aktivitas */
            <div className="col-span-full space-y-4">
              {activities.length === 0 ? (
                <EmptyState message="Belum ada aktivitas ujian." />
              ) : (
                activities.map((act, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-6">
                      <div className="text-4xl bg-purple-50 w-16 h-16 flex items-center justify-center rounded-3xl">📊</div>
                      <div>
                        <h4 className="font-black text-xl text-slate-800">{act.testName}</h4>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{act.date} • {act.participantCount} Siswa</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-xs font-black uppercase">Completed</span>
                      <button className="bg-slate-100 px-6 py-3 rounded-2xl font-black text-slate-600 hover:bg-slate-200 transition">VIEW REPORT</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full py-20 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
      <div className="text-6xl mb-4">☁️</div>
      <p className="text-slate-300 font-black text-xl uppercase tracking-tighter">{message}</p>
    </div>
  );
}