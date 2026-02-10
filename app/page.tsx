'use client'
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [heroContent, setHeroContent] = useState<any[]>([])
  const [leaders, setLeaders] = useState<any[]>([])
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: liveData } = await supabase.from('livestream_status').select('is_live').eq('id', 1).single();
      setIsLive(liveData?.is_live || false);

      const { data: hero } = await supabase.from('site_content').select('*').eq('section', 'hero');
      const { data: ldr } = await supabase.from('site_content').select('*').eq('section', 'leader');
      const { data: gal } = await supabase.from('site_content').select('*').eq('section', 'gallery');
      const { data: evs } = await supabase.from('events').select('*').order('event_date', { ascending: true });
      
      setHeroContent(hero || [])
      setLeaders(ldr || [])
      setGalleryItems(gal || [])
      setEvents(evs || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-purple-900 font-black animate-pulse">LOADING...</div>

  const mainHero = heroContent?.[0] || { 
    image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80',
    subtitle: 'Where lives are transformed and testimonies are birthed.'
  };

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      
      {/* SECTION 1: HERO - Reduced height for Desktop (60vh instead of 85vh) */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center text-white overflow-hidden border-b-4 border-yellow-500">
        <div 
          className="absolute inset-0 bg-cover bg-top" // Changed bg-center to bg-top
          style={{ backgroundImage: `url('${mainHero.image_url}')` }}
        >
          <div className="absolute inset-0 bg-purple-950/70"></div>
        </div>
        <div className="relative z-10 max-w-5xl px-6 text-center">
          {isLive && (
            <div className="mb-4 flex justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black animate-pulse tracking-widest uppercase">Live Now</span>
            </div>
          )}
          <h1 className="text-3xl md:text-6xl font-black mb-4 leading-tight uppercase tracking-tighter">
            WELCOME TO G.O.T.
          </h1>
          <p className="text-sm md:text-xl mb-8 text-purple-100 italic font-medium max-w-2xl mx-auto">
            "{mainHero.subtitle}"
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isLive && (
              <a href="/live" className="bg-red-600 text-white font-black py-3 px-8 rounded-full shadow-xl hover:bg-white hover:text-red-600 transition-all text-sm">
                JOIN LIVE SERVICE
              </a>
            )}
            <a href="/sermons" className="backdrop-blur-sm border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-purple-900 transition-all text-sm">
              WATCH SERMONS
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: OVERSEER - Fixed Image Cropping */}
      <section className="py-12 md:py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <div className="relative group">
              <div className="absolute -top-3 -left-3 w-full h-full border-2 border-yellow-500 rounded-2xl"></div>
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl h-[400px] md:h-[500px]">
                <img 
                  src="/overseer-photo.jpg" 
                  alt="General Overseer" 
                  className="w-full h-full object-cover object-top" // object-top ensures the head isn't cut off
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'; }}
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <span className="text-purple-900 font-black tracking-widest uppercase text-xs">Visionary Leader</span>
            <h2 className="text-3xl md:text-4xl font-black text-purple-900 mt-2 mb-6 uppercase">Our General Overseer</h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 italic">
              "Glorious Overflowing Testimonies is more than a church; it is an encounter with divinity."
            </p>
            <div className="h-1 w-16 bg-yellow-500 mb-4 mx-auto md:mx-0"></div>
            <p className="font-black text-purple-900 text-xl uppercase">Rev. Apostle Name</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: LEADERSHIP - Fixed Head Cropping with object-top */}
      <section className="py-16 bg-purple-50 px-6">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-black text-purple-900 uppercase">Leadership Team</h2>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {leaders?.map((leader) => (
            <div key={leader.id} className="text-center">
              <div className="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-lg mb-4">
                <img 
                  src={leader.image_url} 
                  alt={leader.title} 
                  className="w-full h-full object-cover object-top" // Ensures faces are visible
                />
              </div>
              <h4 className="font-black text-purple-900 text-sm md:text-lg uppercase leading-tight">{leader.title}</h4>
              <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-widest mt-1">{leader.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* (Gallery and Events follow similarly...) */}
      
    </main>
  )
}
