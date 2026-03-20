"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Tipe Data untuk Soal
type QuestionType = 'quiz' | 'multiple-choice' | 'true-false';

interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  media: string | null;
  options: { id: string; text: string; isCorrect: boolean }[];
  timeLimit: number;
}

export default function CreateQuizScratch() {
  const router = useRouter();
  const [gameName, setGameName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([createNewQuestion('quiz')]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi membuat soal baru
  function createNewQuestion(type: QuestionType): Question {
    const defaultOptions = type === 'true-false' 
      ? [{ id: '1', text: 'True', isCorrect: true }, { id: '2', text: 'False', isCorrect: false }]
      : [
          { id: '1', text: '', isCorrect: true },
          { id: '2', text: '', isCorrect: false },
          { id: '3', text: '', isCorrect: false },
          { id: '4', text: '', isCorrect: false },
        ];
    
    return {
      id: Date.now().toString(),
      type,
      questionText: '',
      media: null,
      options: defaultOptions,
      timeLimit: 30,
    };
  }

  const addQuestion = (type: QuestionType) => {
    const newQ = createNewQuestion(type);
    setQuestions([...questions, newQ]);
    setActiveQuestionIndex(questions.length);
  };

  const updateQuestion = (data: Partial<Question>) => {
    const updated = [...questions];
    updated[activeQuestionIndex] = { ...updated[activeQuestionIndex], ...data };
    setQuestions(updated);
    // Auto-save logic bisa diletakkan di sini (misal ke LocalStorage)
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateQuestion({ media: url });
    }
  };

  const handlePublish = () => {
    const quizCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    alert(`Quiz Published! Code: ${quizCode}`);
    router.push('/quiz/library');
  };

  const currentQ = questions[activeQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Bar */}
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-500 font-bold">← Back</button>
          <input 
            type="text" 
            placeholder="Enter Bioscope Game Name..." 
            className="text-xl font-black uppercase tracking-tighter border-b-2 border-black outline-none focus:border-indigo-500 transition-all w-64"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Save to Draft</button>
          <button onClick={handlePublish} className="px-6 py-2 bg-indigo-600 text-white font-black rounded-xl shadow-[4px_4px_0_0_#312e81] hover:translate-y-1 hover:shadow-none transition-all">Publish</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 p-6">
        {/* Left Sidebar: Question List */}
        <div className="col-span-3 space-y-4">
          <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest">Questions</h3>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {questions.map((q, idx) => (
              <div 
                key={q.id}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${activeQuestionIndex === idx ? 'border-indigo-600 bg-white shadow-md' : 'border-transparent bg-slate-200 opacity-60'}`}
              >
                <span className="text-xs font-black italic"># {idx + 1} - {q.type.toUpperCase()}</span>
                <p className="text-sm font-bold truncate">{q.questionText || 'Empty Question...'}</p>
              </div>
            ))}
          </div>
          
          {/* Add Question Buttons (Point 5) */}
          <div className="pt-4 border-t space-y-2">
            <button onClick={() => addQuestion('quiz')} className="w-full py-3 bg-white border-2 border-dashed border-slate-300 rounded-xl font-bold text-sm hover:border-indigo-500 hover:text-indigo-600 transition-all">+ Quiz (Single)</button>
            <button onClick={() => addQuestion('multiple-choice')} className="w-full py-3 bg-white border-2 border-dashed border-slate-300 rounded-xl font-bold text-sm hover:border-indigo-500 hover:text-indigo-600 transition-all">+ Multiple Choice</button>
            <button onClick={() => addQuestion('true-false')} className="w-full py-3 bg-white border-2 border-dashed border-slate-300 rounded-xl font-bold text-sm hover:border-indigo-500 hover:text-indigo-600 transition-all">+ True or False</button>
          </div>
        </div>

        {/* Main Canvas (Point 2, 3, 4) */}
        <div className="col-span-9 space-y-6">
          <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-[8px_8px_0_0_#000]">
            {/* Toolbar Simbol (Point 2) */}
            <div className="flex gap-2 mb-4 border-b pb-4">
              <button className="p-2 hover:bg-slate-100 rounded font-serif font-bold">B</button>
              <button className="p-2 hover:bg-slate-100 rounded italic">I</button>
              <button className="p-2 hover:bg-slate-100 rounded font-mono">Σ Equation</button>
              <div className="flex-1"></div>
              <select 
                className="bg-slate-100 font-bold px-3 py-1 rounded-lg text-sm"
                value={currentQ.timeLimit}
                onChange={(e) => updateQuestion({ timeLimit: Number(e.target.value) })}
              >
                <option value={10}>10 Sec</option>
                <option value={30}>30 Sec</option>
                <option value={60}>1 Min</option>
              </select>
            </div>

            {/* Question Input */}
            <textarea 
              placeholder="Type your question here (No word limit)..."
              className="w-full text-2xl font-bold outline-none min-h-[100px] resize-none"
              value={currentQ.questionText}
              onChange={(e) => updateQuestion({ questionText: e.target.value })}
            />

            {/* Media Upload Section (Point 3) */}
            <div className="mt-6 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center bg-slate-50">
              {currentQ.media ? (
                <div className="relative group">
                  <img src={currentQ.media} alt="Media" className="max-h-64 rounded-xl shadow-lg" />
                  <button 
                    onClick={() => updateQuestion({ media: null })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >✕</button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-bold text-slate-400 mb-2">Find and insert media</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-black text-white rounded-xl font-black text-xs uppercase"
                  >Upload Image/Video</button>
                  <input type="file" ref={fileInputRef} hidden onChange={handleMediaUpload} />
                </div>
              )}
            </div>

            {/* Options Section (Point 4, 6, 7, 8) */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {currentQ.options.map((opt, oIdx) => (
                <div 
                  key={opt.id}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${opt.isCorrect ? 'border-green-500 bg-green-50 shadow-[4px_4px_0_0_#22c55e]' : 'border-slate-200 bg-white hover:border-slate-400'}`}
                >
                  <button 
                    onClick={() => {
                      const newOpts = [...currentQ.options];
                      if (currentQ.type === 'quiz' || currentQ.type === 'true-false') {
                        newOpts.forEach(o => o.isCorrect = false);
                        newOpts[oIdx].isCorrect = true;
                      } else {
                        newOpts[oIdx].isCorrect = !newOpts[oIdx].isCorrect;
                      }
                      updateQuestion({ options: newOpts });
                    }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${opt.isCorrect ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}
                  >
                    {opt.isCorrect && '✓'}
                  </button>
                  <input 
                    type="text" 
                    placeholder={`Option ${oIdx + 1}`}
                    disabled={currentQ.type === 'true-false'}
                    className="flex-1 bg-transparent outline-none font-bold"
                    value={opt.text}
                    onChange={(e) => {
                      const newOpts = [...currentQ.options];
                      newOpts[oIdx].text = e.target.value;
                      updateQuestion({ options: newOpts });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}