'use client' // This line fixes the "Event handlers" error

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [heroContent, setHeroContent] = useState<any[]>([])
  const [leaders, setLeaders] = useState<any[]>([])
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetching data on the client side
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
    <main className="bg-white min-h-screen">
      
      {/* SECTION 1: DYNAMIC HERO */}
      <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden border-b-8 border-yellow-500">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] hover:scale-110"
          style={{ backgroundImage: `url('${mainHero.image_url}')` }}
        >
          <div className="absolute inset-0 bg-purple-950/70"></div>
        </div>
        <div className="relative z-10 max-w-5xl px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight uppercase">
            {mainHero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-purple-100 italic">
            "{mainHero.subtitle}"
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/live" className="bg-yellow-500 text-purple-950 font-black py-4 px-10 rounded-full shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1">
              JOIN LIVE SERVICE
            </a>
            <a href="/sermons" className="backdrop-blur-md border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-purple-900 transition-all">
              WATCH SERMONS
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE FOUNDER / OVERSEER */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-4 border-yellow-500 rounded-2xl"></div>
            <img 
              src="/overseer-photo.jpg" 
              alt="General Overseer" 
              className="relative z-10 rounded-2xl shadow-2xl object-cover w-full h-[550px]"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-purple-900 font-black tracking-widest uppercase text-sm">Visionary Leader</span>
            <h2 className="text-4xl font-black text-purple-900 mt-2 mb-6 uppercase">Our General Overseer</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6 italic">
              "Glorious Overflowing Testimonies is more than a church; it is an encounter with divinity. We are committed to helping you discover your purpose and manifest the glory of God in every area of your life."
            </p>
            <div className="h-1 w-20 bg-yellow-500 mb-4"></div>
            <p className="font-black text-purple-900 text-xl uppercase tracking-tighter">PS. BRIGHT KYEI AFRIYIE</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: LEADERSHIP TEAM */}
      <section className="py-24 bg-purple-50 px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-purple-900 uppercase mb-4 tracking-tighter">Our Leadership Team</h2>
          <div className="h-1.5 w-24 bg-yellow-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {leaders?.map((leader) => (
            <div key={leader.id} className="text-center group">
              <div className="w-44 h-44 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-yellow-500 transition-all mb-6 transform group-hover:scale-105">
                <img src={leader.image_url} alt={leader.title} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-black text-purple-900 text-lg uppercase">{leader.title}</h4>
              <p className="text-xs text-yellow-600 font-bold uppercase tracking-widest mt-1">{leader.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: BENTO GALLERY */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-black text-purple-900 uppercase">Glorious <span className="text-yellow-600">Gallery</span></h2>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 auto-rows-[300px]">
          {galleryItems?.map((item, index) => (
            <div key={item.id} className={`relative group overflow-hidden rounded-3xl shadow-lg border-2 border-purple-50 ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end">
                <h3 className="text-white font-black text-xl uppercase">{item.title}</h3>
                <p className="text-yellow-500 text-sm font-bold uppercase">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: UPCOMING EVENTS */}
      <section className="py-24 px-8 bg-purple-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b-2 border-purple-800 pb-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Glorious <span className="text-yellow-500">Encounters</span></h2>
            <a href="/contact" className="text-yellow-500 font-bold hover:underline">View Calendar →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events?.map((event) => (
              <div key={event.id} className="bg-purple-900/50 p-8 rounded-3xl border border-purple-800 hover:border-yellow-500 transition-all">
                <span className="text-yellow-500 font-black text-sm tracking-widest uppercase">
                  {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
                <h3 className="text-2xl font-black mt-2 mb-4 uppercase">{event.title}</h3>
                <p className="text-purple-200 text-sm opacity-80 mb-6">{event.description}</p>
                <div className="text-xs font-bold text-white/60">📍 {event.location || 'Church Auditorium'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}