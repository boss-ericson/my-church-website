'use client'
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('live') 
  const [status, setStatus] = useState('')
  const [isCurrentlyLive, setIsCurrentlyLive] = useState<boolean | null>(null)
  const [pendingTestimonies, setPendingTestimonies] = useState<any[]>([])

  // --- SERMON STATES ---
  const [sTitle, setSTitle] = useState('')
  const [sSpeaker, setSSpeaker] = useState('')
  const [sUrl, setSUrl] = useState('')

  // --- SHOP STATES ---
  const [pName, setPName] = useState('')
  const [pPrice, setPPrice] = useState('')
  const [pCat, setPCat] = useState('Books')
  const [pFile, setPFile] = useState<File | null>(null)

  // --- VISUALS/GALLERY STATES ---
  const [vSection, setVSection] = useState('gallery')
  const [vFile, setVFile] = useState<File | null>(null)
  const [vTitle, setVTitle] = useState('')
  const [vSubtitle, setVSubtitle] = useState('')

  // DATA FETCHING
  useEffect(() => {
    fetchCurrentLiveStatus()
    fetchPendingTestimonies()
  }, [activeTab])

  async function fetchCurrentLiveStatus() {
    const { data } = await supabase.from('livestream_status').select('is_live').eq('id', 1).single()
    if (data) setIsCurrentlyLive(data.is_live)
  }

  async function fetchPendingTestimonies() {
    const { data } = await supabase.from('testimonies').select('*').eq('is_approved', false).order('created_at', { ascending: false })
    setPendingTestimonies(data || [])
  }

  // IMAGE UPLOAD HELPER
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('product-images').upload(fileName, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
    return urlData.publicUrl
  }

  // HANDLERS
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

  const handleShop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pFile) return alert("Please select an image")
    setStatus('Adding to Shop...')
    try {
      const url = await uploadImage(pFile)
      await supabase.from('products').insert([{ name: pName, price: parseFloat(pPrice), category: pCat, image_url: url }])
      setPName(''); setPPrice(''); setPFile(null); setStatus('✅ Item added to Shop!');
    } catch (err: any) { setStatus('Error: ' + err.message) }
  }

  const handleVisuals = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vFile) return alert("Please select an image")
    setStatus('Updating Site Visuals...')
    try {
      const url = await uploadImage(vFile)
      await supabase.from('site_content').insert([{ section: vSection, image_url: url, title: vTitle, subtitle: vSubtitle }])
      setVTitle(''); setVSubtitle(''); setVFile(null); setStatus('✅ Visual Content updated!');
    } catch (err: any) { setStatus('Error: ' + err.message) }
  }

  const approveTestimony = async (id: string) => {
    const { error } = await supabase.from('testimonies').update({ is_approved: true }).eq('id', id)
    if (!error) { setStatus('✅ Approved!'); fetchPendingTestimonies(); }
  }

  const deleteTestimony = async (id: string) => {
    const { error } = await supabase.from('testimonies').delete().eq('id', id)
    if (!error) { setStatus('🗑️ Deleted'); fetchPendingTestimonies(); }
  }

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
            <span className="font-black text-[10px] uppercase tracking-widest">Site: {isCurrentlyLive ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </header>

        {/* --- NAVIGATION TABS --- */}
        <div className="flex overflow-x-auto gap-2 mb-8 bg-purple-100 p-2 rounded-2xl no-scrollbar shadow-inner">
          {['live', 'sermons', 'shop', 'visuals', 'testimonies'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 rounded-xl font-black text-[10px] uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-purple-900 text-white shadow-lg' : 'text-purple-900 hover:bg-purple-200'}`}
            >
              {tab === 'testimonies' ? `Review (${pendingTestimonies.length})` : `${tab} Manager`}
            </button>
          ))}
        </div>

        {status && <div className="mb-6 p-4 bg-yellow-400 text-purple-900 font-black rounded-2xl text-center text-xs uppercase animate-pulse shadow-md">{status}</div>}

        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-xl border border-purple-100">
          
          {/* 1. LIVE CONTROL */}
          {activeTab === 'live' && (
            <div className="text-center py-10">
                <h2 className="text-2xl font-black text-purple-900 uppercase mb-8 italic">Broadcasting Signal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <button onClick={() => handleLiveToggle(true)} className="p-8 bg-red-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-red-700 active:scale-95 transition-all">START SERVICE</button>
                    <button onClick={() => handleLiveToggle(false)} className="p-8 bg-black text-white rounded-3xl font-black text-xl shadow-xl hover:bg-gray-900 active:scale-95 transition-all">END SERVICE</button>
                </div>
            </div>
          )}

          {/* 2. SERMON CONTROL */}
          {activeTab === 'sermons' && (
            <form onSubmit={handleSermon} className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-purple-900 uppercase mb-6 text-center underline decoration-yellow-500 underline-offset-8">Publish Sermon</h2>
              <input placeholder="SERMON TITLE" className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold text-black outline-none focus:border-purple-900" value={sTitle} onChange={e => setSTitle(e.target.value)} required />
              <input placeholder="SPEAKER NAME" className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold text-black outline-none focus:border-purple-900" value={sSpeaker} onChange={e => setSSpeaker(e.target.value)} required />
              <input placeholder="YOUTUBE EMBED LINK" className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold text-black outline-none focus:border-purple-900" value={sUrl} onChange={e => setSUrl(e.target.value)} required />
              <button className="w-full bg-purple-900 text-white p-5 rounded-2xl font-black uppercase hover:bg-yellow-500 hover:text-purple-900 transition-all shadow-lg">Add to Archive</button>
            </form>
          )}

          {/* 3. SHOP CONTROL */}
          {activeTab === 'shop' && (
            <form onSubmit={handleShop} className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-purple-900 uppercase mb-6 text-center underline decoration-yellow-500 underline-offset-8">New Product</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="PRODUCT NAME" className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold text-black" value={pName} onChange={e => setPName(e.target.value)} required />
                <input placeholder="PRICE ($)" type="number" step="0.01" className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold text-black" value={pPrice} onChange={e => setPPrice(e.target.value)} required />
              </div>
              <select className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold text-black" value={pCat} onChange={e => setPCat(e.target.value)}>
                <option>Books</option><option>Clothing</option><option>Paraphernalia</option>
              </select>
              <input type="file" onChange={e => setPFile(e.target.files ? e.target.files[0] : null)} className="w-full p-5 font-bold" required />
              <button className="w-full bg-purple-900 text-white p-5 rounded-2xl font-black uppercase shadow-lg">Upload to Shop</button>
            </form>
          )}

          {/* 4. VISUALS/GALLERY CONTROL */}
          {activeTab === 'visuals' && (
            <form onSubmit={handleVisuals} className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-purple-900 uppercase mb-6 text-center underline decoration-yellow-500 underline-offset-8">Update Site Imagery</h2>
              <select className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold text-black" value={vSection} onChange={e => setVSection(e.target.value)}>
                <option value="gallery">Gallery Photo</option>
                <option value="hero">Home Slideshow</option>
                <option value="leader">Leadership Team</option>
              </select>
              <input type="file" onChange={e => setVFile(e.target.files ? e.target.files[0] : null)} className="w-full p-5 font-bold" required />
              <input placeholder="TITLE (NAME OR LABEL)" className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold text-black" value={vTitle} onChange={e => setVTitle(e.target.value)} />
              <input placeholder="SUBTITLE (ROLE OR DESCRIPTION)" className="w-full p-5 bg-gray-50 border-2 rounded-2xl font-bold text-black" value={vSubtitle} onChange={e => setVSubtitle(e.target.value)} />
              <button className="w-full bg-purple-900 text-white p-5 rounded-2xl font-black uppercase shadow-lg">Sync with Website</button>
            </form>
          )}

          {/* 5. TESTIMONY REVIEW */}
          {activeTab === 'testimonies' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-purple-900 uppercase text-center mb-6 italic underline decoration-yellow-500 underline-offset-8">Review Glory Stories</h2>
                {pendingTestimonies.length === 0 ? (
                    <p className="text-center text-gray-400 italic font-bold">No new stories for review.</p>
                ) : (
                    pendingTestimonies.map(t => (
                        <div key={t.id} className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-100 shadow-sm">
                            <p className="text-purple-900 font-bold italic mb-4 leading-relaxed">"{t.story}"</p>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="font-black text-purple-900 text-xs uppercase tracking-widest">— {t.full_name}</span>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button onClick={() => approveTestimony(t.id)} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-md active:scale-95">APPROVE</button>
                                    <button onClick={() => deleteTestimony(t.id)} className="flex-1 bg-red-100 text-red-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-sm active:scale-95">DELETE</button>
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
