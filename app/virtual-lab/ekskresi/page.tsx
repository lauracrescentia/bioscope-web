"use client";
import { useState } from 'react';

export default function UrinalysisLab() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State Soal 1 (Essay)
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  // State Soal 2 (Pilihan Ganda)
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [feedback2, setFeedback2] = useState("");

  const getIllustration = () => "/nefron.jpg";

  // Fungsi Reset Manual
  const resetLab = () => {
    setCurrentStep(0);
    setIsProcessing(false);
    setAnswer("");
    setFeedback("");
    setSelectedOpt(null);
    setFeedback2("");
  };

  const getProgressWidth = () => {
    if (currentStep === 1) return "33%";
    if (currentStep === 2) return "66%";
    if (currentStep === 3) return "100%";
    return "0%";
  };

  const getBarColor = () => {
    if (currentStep === 0) return "bg-red-900"; 
    if (currentStep === 1) return "bg-red-500"; 
    if (currentStep === 2) return "bg-yellow-400"; 
    return "bg-green-500"; 
  };

  const runStep = (step: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsProcessing(false);
    }, 2000);
  };

  const checkAnswer = () => {
    const isCorrect = answer.toLowerCase().includes("filtrasi") || answer.toLowerCase().includes("penyaringan");
    if (isCorrect) {
      setFeedback("Tepat sekali! Glomerulus berfungsi sebagai filter utama.");
    } else {
      setFeedback("Coba periksa kembali peran Glomerulus dalam penyaringan darah.");
    }
  };

  const handleOptionClick = (index: number) => {
    setSelectedOpt(index);
    if (index === 1) { 
      setFeedback2("✅ BENAR! Glukosa seharusnya diserap kembali di Tubulus Kontortus Proksimal.");
    } else {
      setFeedback2("❌ SALAH. Glukosa yang lolos menunjukkan kegagalan pada proses penyerapan kembali.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-black font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* TOP NAVIGATION BAR */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center gap-2 bg-white border-4 border-black px-4 py-2 rounded-xl font-black text-xs shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-none transition-all"
          >
            ⬅️ KEMBALI
          </button>
          
          <button 
            onClick={resetLab}
            className="flex items-center gap-2 bg-red-500 text-white border-4 border-black px-4 py-2 rounded-xl font-black text-xs shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-none transition-all"
          >
            🔄 RESTART LAB
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KOLOM KIRI: VISUALISASI */}
          <div className="bg-white rounded-[2rem] border-4 border-black p-6 shadow-[12px_12px_0_0_#000] flex flex-col items-center">
            <h3 className="font-black uppercase mb-4 self-start bg-black text-white px-4 py-1 rounded-full text-[10px]">
              Visualisasi Struktur Nefron
            </h3>
            
            <div className="relative w-full aspect-video bg-white rounded-xl border-4 border-black overflow-hidden flex items-center justify-center">
              <img 
                src={getIllustration()} 
                alt="Anatomi Nefron" 
                className={`w-full h-full object-contain transition-all duration-700 ${isProcessing ? 'blur-sm scale-105' : 'scale-100'}`}
              />

              {!isProcessing && currentStep > 0 && (
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  <div className="bg-white border-2 border-black p-2 rounded-lg shadow-[4px_4px_0_0_#000] animate-bounce">
                    <p className="text-[10px] font-black text-black uppercase">
                      📍 {currentStep === 1 ? "Glomerulus" : currentStep === 2 ? "Tubulus Proksimal" : "Tubulus Distal"}
                    </p>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-black text-white px-4 py-2 font-black text-xs rounded-full animate-bounce">
                    SEDANG BERPROSES...
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 border-2 border-black rounded-xl w-full">
              <p className="text-[11px] font-bold text-center uppercase text-black leading-tight">
                {currentStep === 0 && "Siapkan sampel darah untuk memulai proses."}
                {currentStep === 1 && "Filtrasi: Glomerulus menyaring sel darah & protein."}
                {currentStep === 2 && "Reabsorpsi: Penyerapan kembali air dan zat berguna."}
                {currentStep === 3 && "Augmentasi: Pembuangan zat toksik ke urin sesungguhnya."}
              </p>
            </div>
          </div>

          {/* KOLOM KANAN: KONTROL */}
          <div className="bg-white rounded-[2rem] border-4 border-black p-8 shadow-[12px_12px_0_0_#000] flex flex-col">
            <h1 className="text-center text-xl font-black uppercase bg-black text-white py-3 rounded-xl mb-8 tracking-tighter">
              Virtual Lab: Sistem Ekskresi
            </h1>

            <div className="space-y-4 flex-grow">
              {[
                { id: 1, title: "1. FILTRASI" },
                { id: 2, title: "2. REABSORPSI" },
                { id: 3, title: "3. AUGMENTASI" }
              ].map((step) => (
                <div key={step.id} className={`p-4 rounded-xl border-2 border-black flex justify-between items-center transition-all ${currentStep >= step.id ? 'bg-slate-50' : 'bg-white'}`}>
                  <h2 className="font-black text-sm text-black">{step.title}</h2>
                  {currentStep >= step.id ? (
                    <span className="font-black text-[10px] text-black border-2 border-black px-2 py-1 rounded-md bg-green-400">DONE ✅</span>
                  ) : (
                    <button 
                      onClick={() => runStep(step.id)}
                      disabled={isProcessing || currentStep !== step.id - 1}
                      className="bg-black text-white px-4 py-1 rounded-md font-black text-[10px] hover:bg-yellow-400 hover:text-black transition disabled:opacity-30 border-2 border-black shadow-[2px_2px_0_0_#000]"
                    >
                      JALANKAN
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex justify-between mb-1">
                <span className="font-black text-[10px] uppercase text-black">Status Kebersihan Darah:</span>
                <span className="font-black text-[10px] text-black">{getProgressWidth()}</span>
              </div>
              <div className="w-full h-8 bg-slate-200 border-2 border-black rounded-lg overflow-hidden relative shadow-[2px_2px_0_0_#000]">
                <div 
                  className={`h-full transition-all duration-1000 border-r-2 border-black ${getBarColor()}`}
                  style={{ width: getProgressWidth() }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-black text-[10px] uppercase text-black mix-blend-difference">
                    {currentStep === 3 ? "DARAH SANGAT BERSIH" : "PEMBERSIHAN BERJALAN..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BAGIAN SOAL ANALISIS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-[2rem] border-4 border-black p-8 shadow-[12px_12px_0_0_#000]">
            <h2 className="font-black text-lg uppercase text-black mb-4">Kasus 1: Albuminuria</h2>
            <p className="font-bold text-sm text-black mb-4">Jika urin mengandung protein tinggi, tahapan manakah yang rusak?</p>
            <textarea 
              className="w-full p-4 border-2 border-black rounded-xl text-sm font-medium focus:bg-yellow-50 text-black h-24 mb-4 outline-none"
              placeholder="Tulis jawaban..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button onClick={checkAnswer} className="w-full bg-black text-white py-3 rounded-xl font-black text-xs hover:bg-yellow-400 hover:text-black transition border-2 border-black shadow-[4px_4px_0_0_#000]">
              SUBMIT JAWABAN
            </button>
            {feedback && <div className={`mt-4 text-xs font-black p-3 rounded-lg border-2 border-black ${feedback.includes("Tepat") ? "bg-green-100" : "bg-red-100"}`}>{feedback}</div>}
          </div>

          <div className="bg-white rounded-[2rem] border-4 border-black p-8 shadow-[12px_12px_0_0_#000]">
            <h2 className="font-black text-lg uppercase text-black mb-4">Kasus 2: Glukosuria</h2>
            <p className="font-bold text-sm text-black mb-4">Ditemukan glukosa pada urin. Kegagalan terjadi pada proses...</p>
            <div className="space-y-3">
              {["Filtrasi di Glomerulus", "Reabsorpsi di Tubulus Proksimal", "Augmentasi di Tubulus Distal"].map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(i)}
                  className={`w-full text-left p-3 border-2 border-black rounded-lg text-xs font-black transition-all ${selectedOpt === i ? (i === 1 ? "bg-green-400" : "bg-red-400") : "bg-white hover:bg-slate-100"}`}
                >
                  {String.fromCharCode(65 + i)}. {option}
                </button>
              ))}
            </div>
            {feedback2 && <div className={`mt-4 text-xs font-black p-3 rounded-lg border-2 border-black ${feedback2.includes("✅") ? "bg-green-100" : "bg-red-100"}`}>{feedback2}</div>}
          </div>
        </div>

      </div>
    </main>
  );
}