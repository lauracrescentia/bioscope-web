"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [filterCode, setFilterCode] = useState('');
  const [activeTab, setActiveTab] = useState<'games' | 'tests'>('games');

  useEffect(() => {
    // 1. Ambil Laporan Game
    const gameReports = JSON.parse(localStorage.getItem('game_reports') || '[]');
    
    // 2. Ambil Laporan Ujian (Activity)
    const testActivity = JSON.parse(localStorage.getItem('test_activity') || '[]');

    // Kita simpan keduanya, nanti difilter berdasarkan tab
    setReports(gameReports.reverse());
  }, []);

  const downloadCSV = () => {
    if (reports.length === 0) return alert("Belum ada data untuk diunduh.");

    const dataToExport = filterCode 
      ? reports.filter(r => (r.gameCode || r.testId).includes(filterCode.toUpperCase()))
      : reports;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'games') {
      csvContent += "Nama Siswa,Kode Game,Skor,Sisa Nyawa,Waktu Selesai\n";
      dataToExport.forEach((r) => {
        csvContent += `${r.name},${r.gameCode},${r.score},${r.livesRemaining},${r.timestamp}\n`;
      });
    } else {
      csvContent += "Nama Ujian,ID Ujian,Tanggal,Jumlah Peserta,Status\n";
      dataToExport.forEach((r) => {
        csvContent += `${r.testName},${r.testId},${r.date},${r.participantCount},${r.status}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_${activeTab}_BIOscope_${filterCode || 'Semua'}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const clearReports = () => {
    if (confirm(`Hapus semua data ${activeTab}? Tindakan ini permanen!`)) {
      const key = activeTab === 'games' ? 'game_reports' : 'test_activity';
      localStorage.removeItem(key);
      setReports([]);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
             <button onClick={() => router.push('/dashboard')} className="text-3xl p-3 bg-white shadow-sm rounded-2xl border border-slate-100 hover:scale-110 transition">🏠</button>
             <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Reports Center 📊</h1>
                <p className="text-slate-500 font-medium font-mono text-sm uppercase tracking-wider">Monitor student performance in real-time</p>
             </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={downloadCSV}
              className="flex-1 md:flex-none bg-green-600 text-white px-8 py-4 rounded-[2rem] font-black shadow-[0_6px_0_#15803d] hover:translate-y-1 hover:shadow-[0_3px_0_#15803d] transition-all flex items-center justify-center gap-2"
            >
              📥 EXPORT TO CSV
            </button>
          </div>
        </header>

        {/* --- TAB SWITCHER & FILTER --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 flex bg-slate-200/50 p-2 rounded-[2.5rem] w-full items-center">
            <button 
              onClick={() => setActiveTab('games')}
              className={`flex-1 py-4 rounded-[2rem] font-black transition-all ${activeTab === 'games' ? 'bg-white shadow-md text-green-600' : 'text-slate-500'}`}
            >
              🎮 GAME SCORES
            </button>
            <button 
              onClick={() => setActiveTab('tests')}
              className={`flex-1 py-4 rounded-[2rem] font-black transition-all ${activeTab === 'tests' ? 'bg-white shadow-md text-sky-600' : 'text-slate-500'}`}
            >
              📝 TEST RESULTS
            </button>
          </div>

          <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center px-6">
            <span className="mr-3">🔍</span>
            <input 
              type="text" 
              placeholder="SEARCH CODE..."
              className="w-full bg-transparent outline-none font-black text-sm uppercase"
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        {/* --- STATS QUICK VIEW --- */}
        <div className="flex justify-between items-center mb-6 px-4">
           <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">
            {activeTab === 'games' ? 'Student Rankings' : 'Exam History'}
           </h2>
           <button onClick={clearReports} className="text-xs font-black text-red-400 hover:text-red-600 uppercase underline">Reset Data</button>
        </div>

        {/* --- TABLE AREA --- */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  {activeTab === 'games' ? (
                    <>
                      <th className="p-8">Student Name</th>
                      <th className="p-8">Game Code</th>
                      <th className="p-8">Final Score</th>
                      <th className="p-8 text-center">Health</th>
                      <th className="p-8 text-right">Timestamp</th>
                    </>
                  ) : (
                    <>
                      <th className="p-8">Exam Title</th>
                      <th className="p-8">Join Code</th>
                      <th className="p-8">Avg Score</th>
                      <th className="p-8 text-center">Participants</th>
                      <th className="p-8 text-right">Date</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reports
                  .filter(r => (activeTab === 'games' ? r.gameCode : r.testId)?.includes(filterCode))
                  .map((report, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-8 font-black text-slate-800 text-lg">
                      {activeTab === 'games' ? report.name : report.testName}
                    </td>
                    <td className="p-8">
                      <span className={`px-4 py-2 rounded-xl font-mono font-black text-xs ${activeTab === 'games' ? 'bg-green-100 text-green-600' : 'bg-sky-100 text-sky-600'}`}>
                        {activeTab === 'games' ? report.gameCode : report.testId}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-800">{activeTab === 'games' ? report.score : report.avgScore || 'N/A'}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Points Achieved</span>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      {activeTab === 'games' ? (
                        <div className="flex justify-center items-center gap-1 bg-red-50 py-2 px-3 rounded-2xl w-fit mx-auto">
                          <span className="text-sm">❤️</span>
                          <span className="font-black text-red-500">{report.livesRemaining}</span>
                        </div>
                      ) : (
                        <span className="font-black text-slate-500 bg-slate-100 px-4 py-2 rounded-2xl">{report.participantCount} Students</span>
                      )}
                    </td>
                    <td className="p-8 text-right text-slate-400 font-bold text-sm">
                      {activeTab === 'games' ? report.timestamp : report.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {reports.length === 0 && (
              <div className="p-32 text-center">
                <div className="text-6xl mb-4 opacity-20">📂</div>
                <p className="text-slate-300 font-black text-xl uppercase tracking-tighter italic">No Data Collected Yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}