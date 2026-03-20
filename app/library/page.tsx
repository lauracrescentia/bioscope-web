"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Game {
  id: number;
  name: string;
  questions: any[];
  createdAt: string;
}

export default function GameLibrary() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    // Mengambil data yang disimpan oleh editor
    const savedGames = JSON.parse(localStorage.getItem('game_library') || '[]');
    setGames(savedGames);
  }, []);

  const deleteGame = (id: number) => {
    if (confirm("Hapus aktivitas ini?")) {
      const updated = games.filter(g => g.id !== id);
      setGames(updated);
      localStorage.setItem('game_library', JSON.stringify(updated));
    }
  };

  return (
    <main className="min-h-screen bg-[#F0F4F8] p-8 font-sans text-[#0F172A]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">My Library</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">Total: {games.length} Aktivitas</p>
          </div>
          <button 
            onClick={() => router.push('/quiz/create')}
            className="px-8 py-4 bg-[#6366F1] text-white rounded-2xl font-black border-4 border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all uppercase italic"
          >
            + Buat Baru
          </button>
        </div>

        {/* Grid Library */}
        {games.length === 0 ? (
          <div className="bg-white border-4 border-dashed border-slate-300 rounded-[3rem] p-20 text-center">
            <p className="text-slate-400 font-bold italic">Belum ada kuis. Ayo buat satu!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <div key={game.id} className="group bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] transition-all">
                
                {/* Card Preview */}
                <div className="p-8 border-b-4 border-black bg-indigo-50">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-white border-2 border-black px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      {game.questions.length} Soal
                    </span>
                    <button onClick={() => deleteGame(game.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      🗑️
                    </button>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic leading-none mb-2">{game.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Dibuat: {new Date(game.createdAt).toLocaleDateString('id-ID')}</p>
                </div>

                {/* Card Actions */}
                <div className="p-6 grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => router.push(`/quiz/host/${game.id}`)}
                    className="col-span-2 py-4 bg-[#FACC15] border-4 border-black rounded-xl font-black uppercase italic shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    🚀 Host Live
                  </button>
                  
                  <button 
                    onClick={() => router.push(`/quiz/play/${game.id}`)}
                    className="py-3 bg-white border-4 border-black rounded-xl font-black text-xs uppercase hover:bg-slate-50 transition-all"
                  >
                    🎮 Solo Play
                  </button>

                  <button 
                    onClick={() => alert("Fitur Assign (PR) segera hadir!")}
                    className="py-3 bg-white border-4 border-black rounded-xl font-black text-xs uppercase hover:bg-slate-50 transition-all"
                  >
                    📅 Assign
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}