'use client'
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  // --- SECURITY STATE ---
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  
  // --- DASHBOARD STATES ---
  const [activeTab, setActiveTab] = useState('live') 
  const [status, setStatus] = useState('')
  const [isCurrentlyLive, setIsCurrentlyLive] = useState<boolean | null>(null)
  const [pendingTestimonies, setPendingTestimonies] = useState<any[]>([])

  // --- FORM STATES ---
  const [sTitle, setSTitle] = useState('')
  const [sSpeaker, setSSpeaker] = useState('')
  const [sUrl, setSUrl] = useState('')

  // 1. SECURITY CHECK HANDLER
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const secretKey = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    
    if (passwordInput === secretKey) {
      setIsAuthorized(true)
    } else {
      alert("❌ Incorrect Admin Key. Access Denied.")
    }
  }

  // 2. DATA FETCHING (Only runs once authorized)
  useEffect(() => {
    if (isAuthorized) {
      fetchCurrentLiveStatus()
      fetchPendingTestimonies()
    }
  }, [isAuthorized, activeTab])

  async function fetchCurrentLiveStatus() {
    const { data } = await supabase.from('livestream_status').select('is_live').eq('id', 1).single()
    if (data) setIsCurrentlyLive(data.is_live)
  }

  async function fetchPendingTestimonies() {
    const { data } = await supabase.from('testimonies').select('*').eq('is_approved', false).order('created_at', { ascending: false })
    setPendingTestimonies(data || [])
  }

  const handleLiveToggle = async (isLive: boolean) => {
    setStatus('Updating Heaven\'s Signal...');
    const { error } = await supabase.from('livestream_status').update({ is_live: isLive }).eq('id', 1);
    if (!error) {
      setIsCurrentlyLive(isLive);
      setStatus(`✅ Site is now ${isLive ? 'LIVE' : 'OFFLINE'}`);
      setTimeout(() => setStatus(''), 3000);
    }
  }

  const handleSermon = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Publishing Message...')
    const { error } = await supabase.from('sermons').insert([{ title: sTitle, speaker: sSpeaker, video_url: sUrl }])
    if (!error) { setSTitle(''); setSSpeaker(''); setSUrl(''); setStatus('✅ Sermon Published!'); }
  }

  const approveTestimony = async (id: string) => {
    const { error } = await supabase.from('testimonies').update({ is_approved: true }).eq('id', id)
    if (!error) { setStatus('✅ Testimony Approved!'); fetchPendingTestimonies(); }
  }

  const deleteTestimony = async (id: string) => {
    const { error } = await supabase.from('testimonies').delete().eq('id', id)
    if (!error) { setStatus('🗑️ Testimony Deleted'); fetchPendingTestimonies(); }
  }

  // --- RENDER CONDITION 1: SHOW LOCK SCREEN ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-purple-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl text-center border-b-8 border-yellow-500">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔑</span>
            </div>
            <h2 className="text-3xl font-black text-purple-900 uppercase mb-2">Admin Portal</h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-8">Secure Access Only</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="ENTER SECRET KEY" 
                className="w-full p-5 bg-gray-50 border-2 border-purple-50 rounded-2xl text-center font-black text-purple-900 tracking-widest outline-none focus:border-purple-900 transition-all"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <button className="w-full bg-purple-900 text-white p-5 rounded-2xl font-black uppercase shadow-lg hover:bg-black transition-all active:scale-95">
                Unlock Dashboard
              </button>
            </form>
          </div>
          <p className="text-center text-purple-300/50 text-[10px] mt-8 uppercase tracking-widest">
            Glorious Overflowing Testimonies © 2026
          </p>
        </div>
      </div>
    )
  }

  // --- RENDER CONDITION 2: SHOW DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-purple-900 uppercase leading-none">Church Manager</h1>
            <span className="text-yellow-600 font-bold text-[10px] uppercase tracking-widest">Master Control Panel</span>
          </div>
          
          <div className={`px-6 py-2 rounded-full border-2 flex items-center gap-3 ${isCurrentlyLive ? 'bg-red-50 border-red-500 text-red-600' : 'bg-gray-100 border-gray-400 text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${isCurrentlyLive ? 'bg-red-600 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="font-black text-[10px] uppercase tracking-widest">Site Status: {isCurrentlyLive ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </header>

        {/* TAB NAVIGATION */}
        <div className="flex overflow-x-auto gap-2 mb-8 bg-purple-100 p-2 rounded-2xl no-scrollbar">
          {['live', 'sermons', 'testimonies'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 rounded-xl font-black text-[10px] uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-purple-900 text-white shadow-lg' : 'text-purple-900 hover:bg-purple-200'}`}
            >
              {tab === 'testimonies' ? `Review (${pendingTestimonies.length})` : `${tab} Control`}
            </button>
          ))}
        </div>

        {status && <div className="mb-6 p-4 bg-yellow-400 text-purple-900 font-black rounded-2xl text-center text-xs uppercase animate-pulse">{status}</div>}

        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-xl border border-purple-100">
          
          {activeTab === 'live' && (
            <div className="text-center py-10">
                <h2 className="text-2xl font-black text-purple-900 uppercase mb-8">Stream Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <button onClick={() => handleLiveToggle(true)} className="p-8 bg-red-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-red-700 active:scale-95 transition-all">START SERVICE</button>
                    <button onClick={() => handleLiveToggle(false)} className="p-8 bg-black text-white rounded-3xl font-black text-xl shadow-xl hover:bg-gray-900 active:scale-95 transition-all">END SERVICE</button>
                </div>
            </div>
          )}

          {activeTab === 'sermons' && (
            <form onSubmit={handleSermon} className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-purple-900 uppercase mb-4 text-center">Upload Sermon</h2>
              <input placeholder="SERMON TITLE" className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold" value={sTitle} onChange={e => setSTitle(e.target.value)} required />
              <input placeholder="SPEAKER NAME" className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold" value={sSpeaker} onChange={e => setSSpeaker(e.target.value)} required />
              <input placeholder="YOUTUBE LINK" className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold" value={sUrl} onChange={e => setSUrl(e.target.value)} required />
              <button className="w-full bg-purple-900 text-white p-5 rounded-2xl font-black uppercase hover:bg-yellow-500 hover:text-purple-900 transition-all">Post to Archive</button>
            </form>
          )}

          {activeTab === 'testimonies' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-purple-900 uppercase text-center mb-6">Pending Review</h2>
                {pendingTestimonies.length === 0 ? (
                    <p className="text-center text-gray-400 italic font-bold">The altar is quiet... no new testimonies yet.</p>
                ) : (
                    pendingTestimonies.map(t => (
                        <div key={t.id} className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-100">
                            <p className="text-purple-900 font-bold italic mb-4">"{t.story}"</p>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="font-black text-purple-900 text-xs uppercase tracking-widest">— {t.full_name}</span>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button onClick={() => approveTestimony(t.id)} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase">APPROVE</button>
                                    <button onClick={() => deleteTestimony(t.id)} className="flex-1 bg-red-100 text-red-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase">DELETE</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
