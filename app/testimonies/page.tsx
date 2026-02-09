'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestimonyPage() {
  const [testimonies, setTestimonies] = useState<any[]>([])
  const [formData, setFormData] = useState({ name: '', title: '', story: '' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchTestimonies()
  }, [])

  async function fetchTestimonies() {
    const { data } = await supabase
      .from('testimonies')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    setTestimonies(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Submitting your testimony...')
    
    const { error } = await supabase.from('testimonies').insert([{
      full_name: formData.name,
      title: formData.title,
      story: formData.story
    }])

    if (error) setStatus('Error: ' + error.message)
    else {
      setStatus('✅ Submitted! It will appear on the wall once reviewed.')
      setFormData({ name: '', title: '', story: '' })
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HEADER */}
      <section className="bg-purple-900 py-20 px-8 text-center border-b-8 border-yellow-500">
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
          The Wall of <span className="text-yellow-500">Overflow</span>
        </h1>
        <p className="text-purple-100 mt-4 italic text-lg max-w-2xl mx-auto">
          "And they overcame him by the blood of the Lamb and by the word of their testimony."
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-3 gap-16 mt-16">
        
        {/* SUBMISSION FORM */}
        <div className="lg:col-span-1">
          <div className="bg-purple-50 p-8 rounded-3xl border-2 border-purple-100 sticky top-28">
            <h2 className="text-2xl font-black text-purple-900 mb-6 uppercase">Share Your Story</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Your Full Name" 
                className="w-full p-4 rounded-xl border-2 border-white focus:border-yellow-500 outline-none text-black"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required 
              />
              <input 
                placeholder="Testimony Title (e.g. Healing, Financial Breakout)" 
                className="w-full p-4 rounded-xl border-2 border-white focus:border-yellow-500 outline-none text-black"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required 
              />
              <textarea 
                placeholder="Tell us what God has done..." 
                rows={6}
                className="w-full p-4 rounded-xl border-2 border-white focus:border-yellow-500 outline-none text-black"
                value={formData.story}
                onChange={e => setFormData({...formData, story: e.target.value})}
                required
              ></textarea>
              <button className="w-full bg-purple-900 text-yellow-500 font-black py-4 rounded-xl hover:bg-black transition-all shadow-lg">
                SUBMIT TESTIMONY
              </button>
              {status && <p className="text-center font-bold text-purple-700 text-sm mt-2">{status}</p>}
            </form>
          </div>
        </div>

        {/* THE WALL */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-black text-purple-900 mb-10 uppercase border-b-4 border-yellow-500 inline-block">Latest Testimonies</h2>
          
          <div className="grid gap-8">
            {testimonies.length > 0 ? testimonies.map((t) => (
              <div key={t.id} className="bg-white p-8 rounded-3xl shadow-md border-l-8 border-purple-900 hover:shadow-xl transition-all">
                <span className="text-yellow-600 font-black text-xs uppercase tracking-widest">{t.title}</span>
                <p className="text-gray-700 text-lg leading-relaxed my-4 italic">"{t.story}"</p>
                <div className="flex items-center gap-4 border-t pt-4 border-gray-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-900">
                    {t.full_name[0]}
                  </div>
                  <span className="font-bold text-purple-900">— {t.full_name}</span>
                </div>
              </div>
            )) : (
              <div className="text-gray-400 italic py-20 text-center border-2 border-dashed rounded-3xl">
                The wall is quiet... for now. Be the first to share your miracle!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}