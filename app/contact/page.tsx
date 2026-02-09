'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Sending your request...')

    const { error } = await supabase
      .from('contact_requests')
      .insert([
        { 
          full_name: formData.name, 
          email: formData.email, 
          message: formData.message 
        }
      ])

    if (error) {
      setStatus('Something went wrong. Please try again.')
    } else {
      setStatus('✅ Received! We are standing in faith with you.')
      setFormData({ name: '', email: '', message: '' }) 
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* PURPLE HEADER */}
      <div className="bg-purple-900 text-white py-16 px-8 text-center border-b-8 border-yellow-500">
        <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tight">
          Contact <span className="text-yellow-500">&</span> Prayer
        </h1>
        <p className="text-purple-100 text-lg max-w-2xl mx-auto italic">
          "For where two or three are gathered together in My name, I am there in the midst of them."
        </p>
      </div>

      <div className="max-w-5xl mx-auto py-16 px-8 grid md:grid-cols-2 gap-12">
        {/* LEFT SIDE: INFO */}
        <div>
          <h2 className="text-3xl font-black text-purple-900 mb-6 uppercase">Get in Touch</h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            Whether you have a question about our services, want to join a ministry, or need someone to agree with you in prayer, we are here for you.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-500 p-3 rounded-full text-purple-900">📍</div>
              <div>
                <h4 className="font-bold text-purple-900">Location</h4>
                <p className="text-gray-600">Visit us at our main auditorium for fellowship.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-yellow-500 p-3 rounded-full text-purple-900">📞</div>
              <div>
                <h4 className="font-bold text-purple-900">Phone</h4>
                <p className="text-gray-600">Call our office for immediate assistance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: THE FORM */}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-purple-100 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full"></div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-purple-900 font-bold mb-1 uppercase text-xs tracking-widest">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="Enter your name"
                className="w-full border-2 border-purple-50 p-4 rounded-xl text-black bg-purple-50/30 focus:border-yellow-500 outline-none transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-purple-900 font-bold mb-1 uppercase text-xs tracking-widest">Email Address</label>
              <input 
                type="email" 
                placeholder="your@email.com"
                className="w-full border-2 border-purple-50 p-4 rounded-xl text-black bg-purple-50/30 focus:border-yellow-500 outline-none transition-all font-medium"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-purple-900 font-bold mb-1 uppercase text-xs tracking-widest">Message or Prayer Request</label>
              <textarea 
                rows={4}
                required
                placeholder="How can we help or pray for you?"
                className="w-full border-2 border-purple-50 p-4 rounded-xl text-black bg-purple-50/30 focus:border-yellow-500 outline-none transition-all font-medium"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-purple-900 text-white font-black py-4 rounded-xl hover:bg-yellow-500 hover:text-purple-950 transition-all shadow-lg uppercase tracking-widest text-sm"
            >
              Send Testimony / Request
            </button>

            {status && (
              <div className="mt-4 p-4 bg-purple-900 text-yellow-500 font-bold text-center rounded-xl animate-pulse">
                {status}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}