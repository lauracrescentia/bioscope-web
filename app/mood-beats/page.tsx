"use client"; // Tambahkan ini karena kita pakai fitur navigasi
import React from 'react';
import { useRouter } from 'next/navigation';

const videos = [
  { title: "Rangka Aksial", src: "/aksial.mp4", color: "bg-yellow-300" },
  { title: "Apendikular Atas", src: "/apendikular-atas.mp4", color: "bg-green-300" },
  { title: "Apendikular Bawah", src: "/apendikular-bawah.mp4", color: "bg-blue-300" },
  { title: "Bentuk Tulang", src: "/bentuk-tulang.mp4", color: "bg-pink-300" },
  { title: "Jenis Tulang", src: "/jenis-tulang.mp4", color: "bg-purple-300" },
  { title: "Hubungan Sendi", src: "/sendi.mp4", color: "bg-orange-300" },
  { title: "Gerak Sendi", src: "/gerak-sendi.mp4", color: "bg-red-300" },
];

export default function MoodBeats() {
  const router = useRouter();

  return (
    <div className="p-8 bg-[#FFF5E1] min-h-screen">
      {/* TOMBOL BACK */}
      <button 
        onClick={() => router.back()} 
        className="mb-6 px-6 py-2 border-4 border-black bg-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        ← Kembali
      </button>

      <h1 className="text-4xl font-black mb-8 border-b-4 border-black pb-2 uppercase italic">
        🦴 Skeleton Beats: Audio-Visual Learning
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <div key={index} className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${video.color} p-4 transition-transform hover:-translate-y-2`}>
            <h2 className="text-xl font-bold mb-3 uppercase tracking-tighter">{video.title}</h2>
            <div className="border-2 border-black bg-black">
              <video controls loop className="w-full aspect-video">
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}