'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('live') 
  const [status, setStatus] = useState('')

  // --- SERMON STATES ---
  const [sTitle, setSTitle] = useState('')
  const [sSpeaker, setSSpeaker] = useState('')
  const [sUrl, setSUrl] = useState('')

  // --- SHOP STATES ---
  const [pName, setPName] = useState('')
  const [pPrice, setPPrice] = useState('')
  const [pCat, setPCat] = useState('Books')
  const [pFile, setPFile] = useState<File | null>(null)

  // --- VISUALS STATES ---
  const [vSection, setVSection] = useState('hero')
  const [vFile, setVFile] = useState<File | null>(null)
  const [vTitle, setVTitle] = useState('')
  const [vSubtitle, setVSubtitle] = useState('')

  // --- TESTIMONY STATES ---
  const [pendingTestimonies, setPendingTestimonies] = useState<any[]>([])

  useEffect(() => {
    if (activeTab === 'testimonies') {
      fetchPendingTestimonies()
    }
  }, [activeTab])

  async function fetchPendingTestimonies() {
    const { data } = await supabase.from('testimonies').select('*').eq('is_approved', false).order('created_at', { ascending: false })
    setPendingTestimonies(data || [])
  }

  // --- SHARED UPLOAD LOGIC ---
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('product-images').upload(fileName, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
    return urlData.publicUrl
  }

  // --- ACTION HANDLERS ---
  const handleLiveToggle = async (isLive: boolean) => {
    setStatus('Updating live status...')
    const { error } = await supabase.from('livestream_status').update({ is_live: isLive }).eq('id', 1)
    setStatus(error ? 'Error updating live' : `✅ Live is now ${isLive ? 'ON' : 'OFF'}`)
  }

  const handleSermon = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Saving sermon...')
    const { error } = await supabase.from('sermons').insert([{ title: sTitle, speaker: sSpeaker, video_url: sUrl }])
    if (!error) { setSTitle(''); setSSpeaker(''); setSUrl(''); setStatus('✅ Sermon Published!'); }
  }

  const handleShop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pFile) return alert("Select an image")
    setStatus('Uploading product...')
    try {
      const url = await uploadImage(pFile)
      await supabase.from('products').insert([{ name: pName, price: parseFloat(pPrice), category: pCat, image_url: url }])
      setPName(''); setPPrice(''); setPFile(null); setStatus('✅ Item added to Shop!');
    } catch (err: any) { setStatus('Error: ' + err.message) }
  }

  const handleVisuals = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vFile) return alert("Select an image")
    setStatus('Uploading visual...')
    try {
      const url = await uploadImage(vFile)
      await supabase.from('site_content').insert([{ section: vSection, image_url: url, title: vTitle, subtitle: vSubtitle }])
      setVTitle(''); setVSubtitle(''); setVFile(null); setStatus('✅ Site visual updated!');
    } catch (err: any) { setStatus('Error: ' + err.message) }
  }

  const approveTestimony = async (id: string) => {
    const { error } = await supabase.from('testimonies').update({ is_approved: true }).eq('id', id)
    if (!error) { setStatus('✅ Testimony Approved!'); fetchPendingTestimonies(); }
  }

  const deleteTestimony = async (id: string) => {
    const { error } = await supabase.from('testimonies').delete().eq('id', id)
    if (!error) { setStatus('🗑️ Testimony Deleted'); fetchPendingTestimonies(); }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-purple-900 uppercase">Church Manager Portal</h1>
          <p className="text-gray-500 font-bold text-xs tracking-widest">GLORIOUS OVERFLOWING TESTIMONIES</p>
        </header>

        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap gap-2 mb-8 bg-purple-100 p-2 rounded-2xl shadow-inner">
          {['live', 'sermons', 'shop', 'visuals', 'testimonies'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setStatus(''); }}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-[10px] md:text-xs uppercase transition-all ${activeTab === tab ? 'bg-purple-900 text-white shadow-lg' : 'text-purple-900 hover:bg-purple-200'}`}
            >
              {tab === 'testimonies' ? `Review (${pendingTestimonies.length})` : `${tab} Manager`}
            </button>
          ))}
        </div>

        {status && <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-purple-900 font-bold rounded-r-xl shadow-sm">{status}</div>}

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-purple-100">
          
          {/* 1. LIVE MANAGER */}
          {activeTab === 'live' && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-2xl font-black text-purple-900 uppercase">Livestream Control</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <button onClick={() => handleLiveToggle(true)} className="flex-1 bg-red-600 text-white p-6 rounded-2xl font-black hover:bg-red-700 shadow-xl transition-transform active:scale-95 text-xl">GO LIVE</button>
                <button onClick={() => handleLiveToggle(false)} className="flex-1 bg-gray-400 text-white p-6 rounded-2xl font-black hover:bg-gray-500 shadow-xl transition-transform active:scale-95 text-xl">END STREAM</button>
              </div>
            </div>
          )}

          {/* 2. SERMON MANAGER */}
          {activeTab === 'sermons' && (
            <form onSubmit={handleSermon} className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black text-purple-900 uppercase border-b-4 border-yellow-500 inline-block pb-1">New Sermon</h2>
              <div className="grid gap-4">
                <input placeholder="Sermon Title" className="w-full p-4 bg-gray-50 border-2 rounded-xl text-black" value={sTitle} onChange={e => setSTitle(e.target.value)} required />
                <input placeholder="Speaker" className="w-full p-4 bg-gray-50 border-2 rounded-xl text-black" value={sSpeaker} onChange={e => setSSpeaker(e.target.value)} required />
                <input placeholder="YouTube Embed URL" className="w-full p-4 bg-gray-50 border-2 rounded-xl text-black" value={sUrl} onChange={e => setSUrl(e.target.value)} required />
                <button className="bg-purple-900 text-white p-4 rounded-xl font-black hover:bg-black transition-all uppercase">Publish Message</button>
              </div>
            </form>
          )}

          {/* 3. SHOP MANAGER */}
          {activeTab === 'shop' && (
            <form onSubmit={handleShop} className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black text-purple-900 uppercase border-b-4 border-yellow-500 inline-block pb-1">New Shop Item</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="Item Name" className="p-4 bg-gray-50 border-2 rounded-xl text-black" value={pName} onChange={e => setPName(e.target.value)} required />
                <input placeholder="Price" type="number" step="0.01" className="p-4 bg-gray-50 border-2 rounded-xl text-black" value={pPrice} onChange={e => setPPrice(e.target.value)} required />
                <select className="p-4 bg-gray-50 border-2 rounded-xl text-black" value={pCat} onChange={e => setPCat(e.target.value)}>
                  <option>Books</option><option>Paraphernalia</option><option>Clothing</option>
                </select>
                <input type="file" onChange={e => setPFile(e.target.files ? e.target.files[0] : null)} className="p-4 text-black font-bold" required />
                <button className="md:col-span-2 bg-purple-900 text-white p-4 rounded-xl font-black uppercase">Add to Shop</button>
              </div>
            </form>
          )}

          {/* 4. VISUALS MANAGER */}
          {activeTab === 'visuals' && (
            <form onSubmit={handleVisuals} className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black text-purple-900 uppercase border-b-4 border-yellow-500 inline-block pb-1">Site Content</h2>
              <div className="grid gap-4">
                <select className="p-4 bg-gray-50 border-2 rounded-xl text-black font-bold" value={vSection} onChange={e => setVSection(e.target.value)}>
                  <option value="hero">Home Slideshow</option><option value="leader">Leadership Team</option><option value="gallery">Gallery</option>
                </select>
                <input type="file" onChange={e => setVFile(e.target.files ? e.target.files[0] : null)} className="p-4 text-black font-bold" required />
                <input placeholder="Primary Title (Name or Heading)" className="p-4 bg-gray-50 border-2 rounded-xl text-black" value={vTitle} onChange={e => setVTitle(e.target.value)} />
                <input placeholder="Subtitle (Role or Description)" className="p-4 bg-gray-50 border-2 rounded-xl text-black" value={vSubtitle} onChange={e => setVSubtitle(e.target.value)} />
                <button className="bg-purple-900 text-white p-4 rounded-xl font-black uppercase">Update Visuals</button>
              </div>
            </form>
          )}

          {/* 5. TESTIMONY REVIEWER */}
          {activeTab === 'testimonies' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black text-purple-900 uppercase">Review Submissions</h2>
              {pendingTestimonies.length === 0 ? (
                <p className="text-gray-400 italic">No new testimonies to review.</p>
              ) : (
                <div className="grid gap-4">
                  {pendingTestimonies.map((t) => (
                    <div key={t.id} className="border-2 border-purple-50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-4 hover:border-purple-200 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-black text-purple-900 uppercase text-sm">{t.title}</h4>
                        <p className="text-gray-600 text-sm my-2 leading-relaxed">"{t.story}"</p>
                        <span className="text-xs font-bold text-gray-400 tracking-tighter">— By {t.full_name}</span>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => approveTestimony(t.id)} className="flex-1 md:flex-none bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-green-700 transition-colors">APPROVE</button>
                        <button onClick={() => deleteTestimony(t.id)} className="flex-1 md:flex-none bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-200 transition-colors">DELETE</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}