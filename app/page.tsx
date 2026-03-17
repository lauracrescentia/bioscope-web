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
  updateProfile 
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
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showEnterCode, setShowEnterCode] = useState(false);

  // State untuk Input Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Fungsi Helper untuk Simpan Data & Redirect
  const saveAndRedirect = (user: any) => {
    localStorage.setItem('user', JSON.stringify({
      name: user.displayName || fullName,
      email: user.email,
      photo: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || fullName}`,
      role: role 
    }));
    window.location.href = '/dashboard';
  };

  // Fungsi Login/Daftar Manual
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // PROSES MASUK
        const result = await signInWithEmailAndPassword(auth, email, password);
        saveAndRedirect(result.user);
      } else {
        // PROSES DAFTAR
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Tambahkan Nama ke Profile Firebase
        await updateProfile(result.user, { displayName: fullName });
        alert("Akun berhasil dibuat!");
        saveAndRedirect(result.user);
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      alert("Error: " + error.message);
    }
  };

  // Fungsi Login Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      saveAndRedirect(result.user);
    } catch (error) {
      console.error("Gagal Login Google:", error);
      alert("Gagal login. Pastikan Google Auth sudah 'Enabled' di Firebase Console.");
    }
  };

  const t = {
    id: { welcome: "Selamat Datang di", signIn: "Masuk", signUp: "Daftar", enterCode: "Masukkan Kode", forgot: "Lupa Password?", google: "Lanjut dengan Google", student: "Siswa", teacher: "Guru/Admin", email: "Alamat Email", pass: "Password", name: "Nama Lengkap" },
    en: { welcome: "Welcome to", signIn: "Sign In", signUp: "Sign Up", enterCode: "Enter Code", forgot: "Forgot Password?", google: "Continue with Google", student: "Student", teacher: "Teacher/Admin", email: "Email Address", pass: "Password", name: "Full Name" }
  }[lang];

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-black">
      <div className="absolute top-5 right-5 flex gap-2">
        <button onClick={() => setLang('id')} className={`px-3 py-1 rounded shadow-md transition ${lang === 'id' ? 'bg-green-600 text-white' : 'bg-white'}`}>ID</button>
        <button onClick={() => setLang('en')} className={`px-3 py-1 rounded shadow-md transition ${lang === 'en' ? 'bg-green-600 text-white' : 'bg-white'}`}>EN</button>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Logo" width={80} height={80} className="mb-4" />
          <h1 className="text-4xl font-black italic">
            <span className="text-green-600">BIO</span><span className="text-sky-400">scope</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">{t.welcome} BIOscope</p>
        </div>

        <div className="flex justify-between mb-6 border-b text-slate-400">
          <button onClick={() => {setIsLogin(true); setShowEnterCode(false)}} className={`pb-2 px-2 transition-all ${isLogin && !showEnterCode ? 'border-b-2 border-green-600 font-bold text-green-600' : ''}`}>{t.signIn}</button>
          <button onClick={() => {setIsLogin(false); setShowEnterCode(false)}} className={`pb-2 px-2 transition-all ${!isLogin && !showEnterCode ? 'border-b-2 border-green-600 font-bold text-green-600' : ''}`}>{t.signUp}</button>
          <button onClick={() => setShowEnterCode(true)} className={`pb-2 px-2 transition-all ${showEnterCode ? 'border-b-2 border-green-600 font-bold text-green-600' : ''}`}>{t.enterCode}</button>
        </div>

        {showEnterCode ? (
          <div className="space-y-4">
            <input type="text" placeholder="XXXX-XXXX" className="w-full p-4 bg-slate-100 rounded-2xl text-center text-2xl font-mono text-black outline-none border-2 border-transparent focus:border-green-500" />
            <button className="w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition">Join Class</button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleAuth}>
            <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl mb-4">
              <button type="button" onClick={() => setRole('student')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${role === 'student' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}>{t.student}</button>
              <button type="button" onClick={() => setRole('teacher')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${role === 'teacher' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}>{t.teacher}</button>
            </div>

            {!isLogin && (
              <input 
                type="text" 
                placeholder={t.name} 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-4 border rounded-2xl text-black outline-none focus:border-green-500 transition" 
              />
            )}
            
            <input 
              type="email" 
              placeholder={t.email} 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border rounded-2xl text-black outline-none focus:border-green-500 transition" 
            />
            
            <input 
              type="password" 
              placeholder={t.pass} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border rounded-2xl text-black outline-none focus:border-green-500 transition" 
            />

            <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-100">
              {isLogin ? t.signIn : t.signUp}
            </button>

            <div className="relative my-6 text-center">
              <span className="bg-white px-4 text-slate-400 text-xs relative z-10 uppercase tracking-widest">Or</span>
              <hr className="absolute top-1/2 w-full border-slate-100" />
            </div>

            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full border-2 border-slate-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 text-black active:scale-95 transition"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={20} alt="G" />
              {t.google}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}