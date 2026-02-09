'use client'
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [heroContent, setHeroContent] = useState<any[]>([])
  const [leaders, setLeaders] = useState<any[]>([])
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: hero } = await supabase.from('site_content').select('*').eq('section', 'hero').order('display_order', { ascending: true });
      const { data: ldr } = await supabase.from('site_content').select('*').eq('section', 'leader').order('display_order', { ascending: true });
      const { data: gal } = await supabase.from('site_content').select('*').eq('section', 'gallery').limit(6);
      const { data: evs } = await supabase.from('events').select('*').order('event_date', { ascending: true }).limit(3);
      
      setHeroContent(hero || [])
      setLeaders(ldr || [])
      setGalleryItems(gal || [])
      setEvents(evs || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const mainHero = heroContent?.[0] || { 
    image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80',
    title: 'EXPERIENCE THE OVERFLOW',
    subtitle: 'Where lives are transformed and testimonies are birthed.'
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-purple-900 font-bold uppercase tracking-widest animate-pulse">Loading Glory...</div>

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      
      {/* SECTION 1: HERO - Adjusted for mobile heights */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center text-white overflow-hidden border-b-4 md:border-b-8 border-yellow-500">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${mainHero.image_url}')` }}
        >
          <div className="absolute inset-0 bg-purple-950/75"></div>
        </div>
        <div className="relative z-10 max-w-5xl px-6 text-center">
          <h1 className="text-3xl md:text-7xl font-black mb-4 md:mb-6 leading-tight uppercase">
            {mainHero.title}
          </h1>
          <p className="text-lg md:text-2xl mb-8 md:mb-10 text-purple-100 italic">
            "{mainHero.subtitle}"
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/live" className="bg-yellow-500 text-purple-950 font-black py-3 md:py-4 px-8 md:px-10 rounded-full shadow-xl hover:bg-white transition-all text-sm md:text-base">
              JOIN LIVE SERVICE
            </a>
            <a href="/sermons" className="backdrop-blur-sm border-2 border-white text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-full hover:bg-white hover:text-purple-900 transition-all text-sm md:text-base">
              WATCH SERMONS
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: OVERSEER - Now stacks on mobile */}
      <section className="py-16 md:py-24 px-6 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 w-full h-full border-2 md:border-4 border-yellow-500 rounded-2xl"></div>
            <img 
              src="/overseer-photo.jpg" 
              alt="General Overseer" 
              className="relative z-10 rounded-2xl shadow-2xl object-cover w-full h-[350px] md:h-[550px]"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <span className="text-purple-900 font-black tracking-widest uppercase text-xs md:text-sm">Visionary Leader</span>
            <h2 className="text-3xl md:text-4xl font-black text-purple-900 mt-2 mb-4 md:mb-6 uppercase">Our General Overseer</h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 italic">
              "Glorious Overflowing Testimonies is more than a church; it is an encounter with divinity."
            </p>
            <div className="h-1 w-16 bg-yellow-500 mb-4 mx-auto md:mx-0"></div>
            <p className="font-black text-purple-900 text-lg md:text-xl uppercase tracking-tighter">Rev. Apostle Name Here</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: LEADERSHIP - 2 columns on mobile, 4 on desktop */}
      <section className="py-16 md:py-24 bg-purple-50 px-6 md:px-8">
        <div className="max-w-7xl mx-auto text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-purple-900 uppercase mb-4">Leadership Team</h2>
          <div className="h-1 w-20 bg-yellow-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-6xl mx-auto">
          {leaders?.map((leader) => (
            <div key={leader.id} className="text-center group">
              <div className="w-28 h-28 md:w-44 md:h-44 mx-auto rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg mb-4">
                <img src={leader.image_url} alt={leader.title} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-black text-purple-900 text-sm md:text-lg uppercase leading-tight">{leader.title}</h4>
              <p className="text-[10px] md:text-xs text-yellow-600 font-bold uppercase tracking-widest mt-1">{leader.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: GALLERY - Simplified grid for mobile */}
      <section className="py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-purple-900 uppercase">Gallery</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems?.map((item) => (
            <div key={item.id} className="relative h-64 overflow-hidden rounded-2xl shadow-md">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: EVENTS - Stacks on mobile */}
      <section className="py-16 md:py-24 px-6 md:px-8 bg-purple-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 border-b border-purple-800 pb-6">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center sm:text-left">Upcoming Events</h2>
            <a href="/contact" className="text-yellow-500 font-bold hover:underline text-sm uppercase">View All →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events?.map((event) => (
              <div key={event.id} className="bg-purple-900/40 p-6 md:p-8 rounded-2xl border border-purple-800">
                <span className="text-yellow-500 font-black text-xs uppercase tracking-widest">
                  {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <h3 className="text-xl md:text-2xl font-black mt-2 mb-4 uppercase">{event.title}</h3>
                <p className="text-purple-200 text-sm opacity-80 mb-4">{event.description}</p>
                <div className="text-[10px] font-bold text-white/50">📍 {event.location || 'Church Auditorium'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
