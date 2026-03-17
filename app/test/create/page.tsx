"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTest() {
  const router = useRouter();
  const [testName, setTestName] = useState('');
  const [totalTime, setTotalTime] = useState(60);
  const [attempts, setAttempts] = useState(1);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState<'editor' | 'selector'>('selector');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State untuk soal yang sedang diedit
  const [editingQ, setEditingQ] = useState({
    type: 'quiz', // quiz, multiple, true-false
    text: '',
    media: null as string | null,
    options: ['', '', '', ''],
    correctAnswers: [] as number[],
  });

  const resetEditor = () => {
    setEditingQ({
      type: 'quiz',
      text: '',
      media: null,
      options: ['', '', '', ''],
      correctAnswers: [],
    });
    setCurrentView('selector');
  };

  const handleSaveQuestion = () => {
    if (!editingQ.text) return alert("Type your question first!");
    if (editingQ.correctAnswers.length === 0) return alert("Please determine the correct answer!");

    setQuestions([...questions, { ...editingQ, id: Date.now() }]);
    resetEditor();
  };

  const finalizeTest = () => {
    if (!testName || questions.length === 0) return alert("Test name and at least 1 question are required!");
    
    const testData = {
      id: "TEST-" + Math.floor(1000 + Math.random() * 9000),
      name: testName,
      duration: totalTime,
      attempts: attempts,
      questions: questions,
      createdAt: new Date().toISOString()
    };

    const library = JSON.parse(localStorage.getItem('test_library') || '[]');
    localStorage.setItem('test_library', JSON.stringify([...library, testData]));
    
    alert("Test saved to Library!");
    router.push('/test');
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 text-black font-sans">
      
      {/* --- TOP BAR (EXIT BUTTON) --- */}
      <div className="max-w-6xl mx-auto w-full mb-6 flex justify-between items-center px-4">
        <button 
          onClick={() => router.push('/test')}
          className="flex items-center gap-2 font-bold text-slate-400 hover:text-red-500 transition-colors group"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span> 
          EXIT TO LIBRARY
        </button>
        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Blank Canvas Mode
        </div>
      </div>

      {/* --- HEADER CONFIG CARD --- */}
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-8 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[5rem] -z-0 opacity-50"></div>
        
        <div className="relative z-10">
          <input 
            type="text" 
            placeholder="Enter BIOScope Test Name..." 
            className="text-4xl md:text-5xl font-black w-full outline-none border-b-4 border-slate-800 pb-4 placeholder:text-slate-200 mb-10 transition-colors focus:border-sky-500"
            value={testName} onChange={(e) => setTestName(e.target.value)}
          />

          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <div className="flex-1 bg-slate-50 p-5 rounded-[2rem] border-2 border-slate-100 flex items-center justify-between group focus-within:border-sky-200 transition-all">
              <span className="font-bold text-slate-500 ml-2">Total Time (Min):</span>
              <input 
                type="number" 
                className="bg-white w-24 p-3 rounded-xl font-black text-center text-xl outline-none shadow-sm" 
                value={totalTime} 
                onChange={(e) => setTotalTime(Number(e.target.value))} 
              />
            </div>
            
            <div className="flex-1 bg-slate-50 p-5 rounded-[2rem] border-2 border-slate-100 flex items-center justify-between group focus-within:border-purple-200 transition-all">
              <span className="font-bold text-slate-500 ml-2">Attempts:</span>
              <div className="relative">
                <select 
                  className="bg-white pl-6 pr-10 py-3 rounded-xl font-black text-xl outline-none shadow-sm appearance-none cursor-pointer"
                  value={attempts} 
                  onChange={(e) => setAttempts(Number(e.target.value))}
                >
                  <option value={1}>1 Attempt</option>
                  <option value={2}>2 Attempts</option>
                  <option value={0}>Unlimited</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
              </div>
            </div>
          </div>

          <button 
            onClick={finalizeTest} 
            className="w-full bg-[#00D97E] text-white py-6 rounded-[2.5rem] text-2xl font-black shadow-[0_10px_0_#00A862] hover:translate-y-1 hover:shadow-[0_5px_0_#00A862] active:translate-y-2 active:shadow-none transition-all"
          >
            SAVE TO LIBRARY
          </button>
        </div>
      </div>

      {/* --- EDITOR SECTION --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
        
        {/* LEFT: QUESTION COUNTER & LIST */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 sticky top-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions</p>
                <h3 className="text-5xl font-black text-slate-800">{questions.length}</h3>
              </div>
              <div className="text-3xl">🧩</div>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {questions.map((q, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold flex gap-3 group hover:bg-white hover:shadow-md transition-all cursor-default">
                  <span className="text-sky-500">#{i + 1}</span>
                  <span className="truncate text-slate-600">{q.text}</span>
                </div>
              ))}
            </div>

            {currentView === 'editor' && (
              <button 
                onClick={() => setCurrentView('selector')}
                className="w-full mt-8 py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-bold hover:border-sky-400 hover:text-sky-500 transition-all"
              >
                + New Question
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: CONTENT EDITOR */}
        <div className="lg:col-span-3">
          {currentView === 'selector' ? (
            <div className="bg-white/60 backdrop-blur-sm p-12 rounded-[4rem] text-center border-4 border-dashed border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[400px]">
               <h2 className="text-2xl font-black mb-10 text-slate-400 uppercase tracking-[0.2em]">Select Question Type</h2>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
                  <button onClick={() => { setEditingQ({...editingQ, type: 'quiz', options: ['', '', '', '']}); setCurrentView('editor'); }} className="p-8 bg-white border-2 border-slate-100 rounded-[3rem] hover:border-sky-500 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                    <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🎯</div>
                    <div className="font-black text-slate-700">QUIZ</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Single choice</div>
                  </button>

                  <button onClick={() => { setEditingQ({...editingQ, type: 'multiple', options: ['', '', '', '']}); setCurrentView('editor'); }} className="p-8 bg-white border-2 border-slate-100 rounded-[3rem] hover:border-green-500 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                    <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">✅</div>
                    <div className="font-black text-slate-700 leading-tight">MULTIPLE CHOICE</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Multi-select</div>
                  </button>

                  <button onClick={() => { setEditingQ({...editingQ, type: 'true-false', options: ['True', 'False']}); setCurrentView('editor'); }} className="p-8 bg-white border-2 border-slate-100 rounded-[3rem] hover:border-orange-500 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                    <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">⚖️</div>
                    <div className="font-black text-slate-700 leading-tight">TRUE OR FALSE</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Two options</div>
                  </button>
               </div>
            </div>
          ) : (
            <div className="bg-white p-8 md:p-12 rounded-[4rem] shadow-2xl border border-slate-100 space-y-8 animate-in fade-in zoom-in duration-500">
              
              {/* TOOLBAR */}
              <div className="flex flex-wrap gap-2 bg-slate-800 p-3 rounded-[2rem] shadow-lg">
                <button className="px-5 py-2 text-white font-black hover:bg-white/10 rounded-xl transition">B</button>
                <button className="px-5 py-2 text-white italic font-serif hover:bg-white/10 rounded-xl transition">I</button>
                <button className="px-5 py-2 text-white font-bold hover:bg-white/10 rounded-xl transition">Σ Equation</button>
                <div className="h-8 w-[1px] bg-slate-600 mx-2 self-center"></div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-sky-500 text-white rounded-[1.2rem] font-bold hover:bg-sky-400 transition shadow-md flex items-center gap-2"
                >
                  🖼️ Find & Insert Media
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setEditingQ({...editingQ, media: URL.createObjectURL(file)});
                }} />
              </div>

              {/* QUESTION INPUT */}
              <div className="space-y-4">
                <textarea 
                  placeholder="Type your question here..."
                  className="w-full text-3xl font-bold p-10 bg-slate-50 rounded-[3rem] min-h-[220px] outline-none border-4 border-transparent focus:border-sky-100 transition-all shadow-inner placeholder:text-slate-200"
                  value={editingQ.text} onChange={(e) => setEditingQ({...editingQ, text: e.target.value})}
                />
                
                {editingQ.media && (
                  <div className="relative w-full max-h-80 rounded-[2.5rem] overflow-hidden border-8 border-slate-50 group shadow-lg">
                    <img src={editingQ.media} className="w-full h-full object-contain bg-slate-900" alt="Preview" />
                    <button 
                      onClick={() => setEditingQ({...editingQ, media: null})}
                      className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              {/* OPTIONS AREA */}
              <div className="space-y-6">
                <p className="font-black text-slate-300 uppercase text-xs tracking-[0.3em] pl-4">Select Correct Answer(s):</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editingQ.options.map((opt, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-5 rounded-[2.5rem] border-4 transition-all ${editingQ.correctAnswers.includes(idx) ? 'border-green-400 bg-green-50 shadow-lg scale-[1.02]' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-100'}`}>
                      <button 
                        onClick={() => {
                          let newCorrect = [...editingQ.correctAnswers];
                          if (editingQ.type === 'multiple') {
                            newCorrect = newCorrect.includes(idx) ? newCorrect.filter(a => a !== idx) : [...newCorrect, idx];
                          } else {
                            newCorrect = [idx];
                          }
                          setEditingQ({...editingQ, correctAnswers: newCorrect});
                        }}
                        className={`w-14 h-14 rounded-[1.5rem] font-black text-xl transition-all shadow-sm shrink-0 ${editingQ.correctAnswers.includes(idx) ? 'bg-green-500 text-white rotate-[360deg]' : 'bg-white text-slate-300 hover:text-slate-400'}`}
                      >
                        {editingQ.type === 'true-false' ? (idx === 0 ? 'T' : 'F') : (idx + 1)}
                      </button>
                      
                      {editingQ.type === 'true-false' ? (
                        <span className="font-black text-xl text-slate-700">{opt}</span>
                      ) : (
                        <input 
                          type="text" value={opt} 
                          onChange={(e) => {
                            const newOpt = [...editingQ.options];
                            newOpt[idx] = e.target.value;
                            setEditingQ({...editingQ, options: newOpt});
                          }}
                          className="flex-1 bg-transparent outline-none font-bold text-xl text-slate-700 placeholder:text-slate-300" 
                          placeholder={`Option ${idx+1}...`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-10">
                <button onClick={resetEditor} className="flex-1 py-6 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-xl hover:bg-red-50 hover:text-red-500 transition-all">
                  CANCEL
                </button>
                <button 
                  onClick={handleSaveQuestion} 
                  className="flex-[2] py-6 bg-black text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-slate-800 transition-all transform active:scale-95"
                >
                  SAVE QUESTION & ADD NEXT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}