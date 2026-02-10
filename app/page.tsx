'use client'
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [heroContent, setHeroContent] = useState<any[]>([])
  const [leaders, setLeaders] = useState<any[]>([])
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([]) // For the Blog
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: liveData } = await supabase.from('livestream_status').select('is_live').eq('id', 1).single();
      setIsLive(liveData?.is_live || false);

      const { data: hero } = await supabase.from('site_content').select('*').eq('section', 'hero');
      const { data: ldr } = await supabase.from('site_content').select('*').eq('section', 'leader');
      const { data: gal } = await supabase.from('site_content').select('*').eq('section', 'gallery').limit(6);
      const { data: evs } = await supabase.from('events').select('*').order('event_date', { ascending: true }).limit(3);
      const { data: blg } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(3);
      
      setHeroContent(hero || [])
      setLeaders(ldr || [])
      setGalleryItems(gal || [])
      setEvents(evs || [])
      setPosts(blg || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-purple-900 font-black animate-pulse uppercase tracking-widest">Loading GOT Online...</div>

  const mainHero = heroContent?.[0] || { 
    image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80',
    subtitle: 'Where lives are transformed and testimonies are birthed.'
  };

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      
      {/* 1. HERO - Desktop Optimized Height */}
      <section className="relative h-[55vh] flex items-center justify-center text-white border-b-4 border-yellow-500">
        <div className="absolute inset-0 bg-cover bg-top" style={{ backgroundImage: `url('${mainHero.image_url}')` }}>
          <div className="absolute inset-0 bg-purple-950/75"></div>
        </div>
        <div className="relative z-10 max-w-5xl px-6 text-center">
          <h1 className="text-4xl md:text-7xl font-black mb-4 leading-tight uppercase tracking-tighter">
            WELCOME TO G.O.T.
          </h1>
          <p className="text-base md:text-2xl mb-8 text-purple-100 italic">"{mainHero.subtitle}"</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isLive && (
              <a href="/live" className="bg-red-600 text-white font-black py-4 px-10 rounded-full shadow-xl hover:bg-white hover:text-red-600 transition-all text-sm animate-pulse">
                JOIN LIVE SERVICE
              </a>
            )}
            <a href="/sermons" className="backdrop-blur-sm border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-purple-900 transition-all text-sm">
              WATCH SERMONS
            </a>
          </div>
        </div>
      </section>

      {/* 2. OVERSEER - Top-aligned cropping */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-4 border-yellow-500 rounded-3xl"></div>
            <img 
              src="/overseer-photo.jpg" 
              className="relative z-10 rounded-3xl shadow-2xl object-cover object-top w-full h-[400px] md:h-[600px]"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'; }}
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-purple-900 mb-6 uppercase">Our General Overseer</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 italic">"Building a people of power, praise, and overflow."</p>
            <p className="font-black text-purple-950 text-2xl uppercase border-l-4 border-yellow-500 pl-4">Rev. Apostle [Name]</p>
          </div>
        </div>
      </section>

      {/* 3. PASTOR'S PEN (BLOG) - New Section */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-purple-900 uppercase">Pastor's Pen</h2>
              <div className="h-1 w-20 bg-yellow-500 mt-2"></div>
            </div>
            <a href="/blog" className="text-purple-900 font-bold text-sm hover:text-yellow-600 uppercase tracking-widest">Read All →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-purple-50 p-8 rounded-3xl border-b-4 border-purple-200 hover:border-yellow-500 transition-all group">
                <h3 className="text-xl font-black text-purple-900 uppercase mb-4 group-hover:text-yellow-600 transition-colors">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-6">{post.content}</p>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Published: {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. UPCOMING EVENTS - Restored */}
      <section className="py-16 bg-purple-950 text-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black uppercase mb-10 text-center md:text-left">Upcoming Gatherings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white/10 p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-yellow-500 font-black text-xs uppercase mb-2">
                  {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 className="text-2xl font-black uppercase mb-4">{event.title}</h3>
                <p className="text-purple-100/70 text-sm mb-6">{event.description}</p>
                <div className="text-[10px] font-bold text-yellow-500">📍 {event.location || 'Main Sanctuary'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LEADERSHIP - No-crop headshots */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-black text-purple-900 uppercase">Leadership Team</h2>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {leaders.map((leader) => (
            <div key={leader.id} className="text-center">
              <div className="w-32 h-32 md:w-52 md:h-52 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl mb-6">
                <img src={leader.image_url} className="w-full h-full object-cover object-top" />
              </div>
              <h4 className="font-black text-purple-900 text-sm md:text-xl uppercase">{leader.title}</h4>
              <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-widest mt-1">{leader.subtitle}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
