"use client";
import { useState } from 'react';
import Image from 'next/image';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail 
} from "firebase/auth";

// --- KONFIGURASI FIREBASE ASLI ---
const firebaseConfig = {
  apiKey: "AIzaSyBDMV8OV4AXIgfu34tCiZpODDQrCYuIFF4",
  authDomain: "bioscope-web.firebaseapp.com",
  projectId: "bioscope-web",
  storageBucket: "bioscope-web.firebasestorage.app",
  messagingSenderId: "446037855492",
  appId: "1:446037855492:web:c26264ea4d5799b09ed451"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function LoginPage() {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [mode, setMode] = useState<'signin' | 'signup' | 'entercode'>('signin');
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  // State untuk Input Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [accessCode, setAccessCode] = useState('');

  // Dictionary Bahasa
  const t = {
    id: { 
      welcome: "Welcome to", 
      signIn: "Sign In", 
      signUp: "Sign Up", 
      enterCode: "Enter Code", 
      loginTitle: "Login to your BIOscope account",
      newTo: "New to BIOscope?",
      createAcc: "Create account",
      createTitle: "Create BIOscope account",
      already: "Already have an account?",
      loginLink: "Log in",
      forgot: "Forgot Password?", 
      google: "Lanjut dengan Google", 
      student: "Siswa", 
      teacher: "Guru/Admin", 
      emailPh: "Alamat Email", 
      passPh: "Password", 
      namePh: "Nama Lengkap",
      codePh: "Masukkan Kode (Kuis/Test/Game)",
      joinBtn: "Mulai Kuis",
      resetAlert: "Masukkan email terlebih dahulu untuk menerima link reset password."
    },
    en: { 
      welcome: "Welcome to", 
      signIn: "Sign In", 
      signUp: "Sign Up", 
      enterCode: "Enter Code", 
      loginTitle: "Login to your BIOscope account",
      newTo: "New to BIOscope?",
      createAcc: "Create account",
      createTitle: "Create BIOscope account",
      already: "Already have an account?",
      loginLink: "Log in",
      forgot: "Forgot Password?", 
      google: "Continue with Google", 
      student: "Student", 
      teacher: "Teacher/Admin", 
      emailPh: "Email Address", 
      passPh: "Password", 
      namePh: "Full Name",
      codePh: "Enter Code (Quiz/Test/Game)",
      joinBtn: "Start Quiz",
      resetAlert: "Please enter your email first to receive the password reset link."
    }
  }[lang];

  const saveAndRedirect = (user: any) => {
    localStorage.setItem('user', JSON.stringify({
      name: user.displayName || fullName || 'User',
      email: user.email,
      photo: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || fullName}`,
      role: role 
    }));
    window.location.href = '/dashboard';
  };

  const handleDirectAccess = () => {
    if (!accessCode) {
      alert("Please enter a code!");
      return;
    }
    window.location.href = `/play?code=${accessCode}`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'signin') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        saveAndRedirect(result.user);
      } else if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: fullName });
        saveAndRedirect(result.user);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      saveAndRedirect(result.user);
    } catch (error: any) {
      console.error("Gagal Login Google:", error);
      alert("Gagal login Google.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert(t.resetAlert);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Link reset password telah dikirim ke email kamu!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-black relative">
      
      <div className="absolute top-5 right-5 flex gap-2">
        <button onClick={() => setLang('id')} className={`px-3 py-1 rounded shadow-md transition ${lang === 'id' ? 'bg-green-600 text-white' : 'bg-white'}`}>ID</button>
        <button onClick={() => setLang('en')} className={`px-3 py-1 rounded shadow-md transition ${lang === 'en' ? 'bg-green-600 text-white' : 'bg-white'}`}>EN</button>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100 flex flex-col items-center">
        
        {/* Logo Section - Ukuran diperbesar ke 160 agar lebih jelas */}
        <div className="relative mb-2 flex justify-center">
           <Image 
            src="/logo.png" 
            alt="Logo" 
            width={160} 
            height={160} 
            className="mix-blend-multiply object-contain" 
            priority
          />
        </div>
        
        <h1 className="text-3xl font-black text-center">
          <span className="text-gray-800">{t.welcome} </span>
          <span className="text-green-600">BIO</span><span className="text-sky-400">scope</span>
        </h1>
        
        <p className="text-slate-500 text-sm mt-1 mb-8 italic text-center font-medium">Discover the fascinating world of biology</p>

        <div className="flex w-full justify-between mb-8 border-b text-slate-400">
          <button onClick={() => setMode('signin')} className={`pb-2 px-2 transition-all ${mode === 'signin' ? 'border-b-2 border-green-600 font-bold text-green-600' : ''}`}>{t.signIn}</button>
          <button onClick={() => setMode('signup')} className={`pb-2 px-2 transition-all ${mode === 'signup' ? 'border-b-2 border-green-600 font-bold text-green-600' : ''}`}>{t.signUp}</button>
          <button onClick={() => setMode('entercode')} className={`pb-2 px-2 transition-all ${mode === 'entercode' ? 'border-b-2 border-green-600 font-bold text-green-600' : ''}`}>{t.enterCode}</button>
        </div>

        <div className="w-full">
          {mode === 'entercode' ? (
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder={t.codePh} 
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full p-4 bg-slate-100 rounded-2xl text-center text-xl font-mono text-black outline-none border-2 border-transparent focus:border-green-500" 
              />
              <button 
                onClick={handleDirectAccess} 
                className="w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition shadow-lg"
              >
                {t.joinBtn}
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleAuth}>
              <div className="text-center mb-4">
                <h2 className="font-bold text-lg">{mode === 'signin' ? t.loginTitle : t.createTitle}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {mode === 'signin' ? (
                    <>{t.newTo} <span onClick={() => setMode('signup')} className="text-green-600 cursor-pointer underline">{t.createAcc}</span></>
                  ) : (
                    <>{t.already} <span onClick={() => setMode('signin')} className="text-green-600 cursor-pointer underline">{t.loginLink}</span></>
                  )}
                </p>
              </div>

              <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl mb-4">
                <button type="button" onClick={() => setRole('student')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${role === 'student' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}>{t.student}</button>
                <button type="button" onClick={() => setRole('teacher')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${role === 'teacher' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}>{t.teacher}</button>
              </div>

              {mode === 'signup' && (
                <input type="text" placeholder={t.namePh} required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-4 border rounded-2xl text-black outline-none focus:border-green-500 transition" />
              )}
              <input type="email" placeholder={t.emailPh} required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 border rounded-2xl text-black outline-none focus:border-green-500 transition" />
              <input type="password" placeholder={t.passPh} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 border rounded-2xl text-black outline-none focus:border-green-500 transition" />

              {mode === 'signin' && (
                <div className="text-right">
                  <button type="button" onClick={handleForgotPassword} className="text-xs text-slate-400 hover:text-green-600 transition">{t.forgot}</button>
                </div>
              )}

              <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-100">
                {mode === 'signin' ? t.signIn : t.signUp}
              </button>

              <div className="relative my-6 text-center">
                <span className="bg-white px-4 text-slate-400 text-xs relative z-10 uppercase tracking-widest">Or</span>
                <hr className="absolute top-1/2 w-full border-slate-100" />
              </div>

              <button type="button" onClick={handleGoogleLogin} className="w-full border-2 border-slate-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 text-black active:scale-95 transition">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={20} alt="G" />
                {t.google}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}