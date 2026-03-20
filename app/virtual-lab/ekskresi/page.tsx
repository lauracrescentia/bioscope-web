"use client";
import { useRouter } from 'next/navigation';

export default function VirtualLabIndex() {
  const router = useRouter();

  const labs = [
    {
      id: 'blood-test',
      title: 'Uji Golongan Darah',
      category: 'Sistem Peredaran Darah',
      icon: '💉',
      description: 'Identifikasi golongan darah melalui reaksi antigen-antibodi. Pelajari konsep aglutinasi menggunakan reagen Anti-A, B, AB, dan Rh.',
      path: '/virtual-lab/blood-test',
      accent: 'bg-red-500',
      shadow: 'shadow-[12px_12px_0_0_#991b1b]'
    },
    {
      id: 'heart-rate',
      title: 'Aktivitas & Jantung',
      category: 'Sistem Peredaran Darah',
      icon: '🏃‍♂️',
      description: 'Amati bagaimana olahraga memengaruhi detak jantung secara real-time. Pelajari hubungan antara aktivitas fisik dengan kebutuhan oksigen.',
      path: '/virtual-lab/heart-rate',
      accent: 'bg-blue-500',
      shadow: 'shadow-[12px_12px_0_0_#1e3a8a]'
    },
    {
      id: 'hypertension',
      title: 'Efek Hipertensi',
      category: 'Sistem Peredaran Darah',
      icon: '🩺',
      description: 'Simulasi beban kerja jantung saat tekanan darah tinggi. Amati perubahan grafik sistolik dan diastolik secara dinamis.',
      path: '/virtual-lab/hypertension',
      accent: 'bg-rose-500',
      shadow: 'shadow-[12px_12px_0_0_#4c0519]'
    },
    {
      id: 'atherosclerosis',
      title: 'Penyempitan Arteri',
      category: 'Sistem Peredaran Darah',
      icon: '🍔',
      description: 'Simulasi pembentukan plak lemak (Aterosklerosis). Amati bagaimana kolesterol menghambat aliran darah dan meningkatkan risiko stroke.',
      path: '/virtual-lab/atherosclerosis',
      accent: 'bg-yellow-400',
      shadow: 'shadow-[12px_12px_0_0_#854d0e]'
    },
    {
      id: 'lung-capacity',
      title: 'Kapasitas Vital Paru',
      category: 'Sistem Pernapasan',
      icon: '🫁',
      description: 'Simulasi pengukuran volume udara maksimal paru-paru. Pelajari perbedaan volume tidal, cadangan inspirasi, dan ekspirasi.',
      path: '/virtual-lab/lung-capacity',
      accent: 'bg-green-400',
      shadow: 'shadow-[12px_12px_0_0_#166534]'
    },
    {
      id: 'excretion-kidney',
      title: 'Filtrasi Ginjal',
      category: 'Sistem Ekskresi',
      icon: '🩸',
      description: 'Lihat bagaimana Nefron bekerja menyaring darah. Pisahkan zat sisa (urea) dari nutrisi penting untuk membentuk urine.',
      path: '/virtual-lab/ekskresi',
      accent: 'bg-orange-400',
      shadow: 'shadow-[12px_12px_0_0_#9a3412]'
    }
  ];

  return (
    <main className="min-h-screen bg-white p-6 md:p-12 text-black font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b-8 border-black pb-8 gap-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase italic">
              Virtual Lab <span className="text-blue-600">🔬</span>
            </h1>
            <p className="text-black font-bold text-xl uppercase tracking-tight mt-2">
              Eksperimen Interaktif Biologi
            </p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-black text-white border-4 border-black rounded-2xl font-black hover:bg-white hover:text-black transition-all shadow-[6px_6px_0_0_#ccc] active:translate-y-1 active:shadow-none uppercase"
          >
            Kembali Ke Dashboard
          </button>
        </header>

        {/* --- LAB GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {labs.map((lab) => (
            <div 
              key={lab.id}
              onClick={() => router.push(lab.path)}
              className={`group bg-white p-8 rounded-[3.5rem] border-8 border-black transition-all cursor-pointer flex flex-col h-full ${lab.shadow} hover:-translate-y-2 active:translate-y-0 active:shadow-none`}
            >
              {/* Icon Container */}
              <div className={`w-20 h-20 ${lab.accent} border-4 border-black rounded-3xl flex items-center justify-center text-5xl mb-6 group-hover:rotate-6 transition-transform shadow-[4px_4px_0_0_#000]`}>
                {lab.icon}
              </div>

              <span className="text-xs font-black text-black/50 uppercase tracking-[0.3em] mb-2 block">
                {lab.category}
              </span>
              
              <h2 className="text-3xl font-black text-black mb-4 uppercase leading-none">
                {lab.title}
              </h2>
              
              <p className="text-black text-base font-bold leading-snug mb-8 flex-1">
                {lab.description}
              </p>

              <button className="w-full py-4 bg-black text-white rounded-2xl font-black text-lg uppercase tracking-widest border-4 border-black group-hover:bg-blue-600 transition-colors shadow-[6px_6px_0_0_#ccc] group-active:translate-y-1 group-active:shadow-none">
                Masuk Lab
              </button>
            </div>
          ))}
        </div>

        {/* --- INFO PANEL --- */}
        <div className="mt-20 bg-yellow-300 p-8 rounded-[3rem] border-8 border-black flex flex-col md:flex-row items-center gap-8 shadow-[12px_12px_0_0_#000]">
          <div className="text-6xl animate-bounce">💡</div>
          <p className="text-black font-black text-lg leading-tight uppercase text-center md:text-left">
            Gunakan simulasi ini untuk memahami proses biologis yang sulit diamati secara langsung di dunia nyata. 
            Setiap lab dilengkapi dengan instruksi dan data real-time!
          </p>
        </div>

      </div>
    </main>
  );
}