import { supabase } from '@/lib/supabase'

export default async function LivePage() {
  const { data: status } = await supabase.from('livestream_status').select('*').single();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-purple-900 py-12 px-8 text-center border-b-4 border-yellow-500">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight">Worship <span className="text-yellow-500">Live</span></h1>
        <p className="text-purple-200 mt-2">Experience the presence of God from anywhere.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {status?.is_live ? (
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-900">
             <iframe width="100%" height="100%" src={status.current_stream_url} title="Church Live Stream" allowFullScreen className="border-0"></iframe>
          </div>
        ) : (
          <div className="bg-purple-50 p-16 rounded-3xl text-center border-2 border-dashed border-purple-200">
            <div className="text-6xl mb-6">🙏</div>
            <h2 className="text-3xl font-black text-purple-900 mb-2 uppercase">We are Currently Offline</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Our next glorious service begins Sunday at 9:00 AM. We can't wait to fellowship with you!</p>
            <a href="/" className="bg-purple-900 text-white px-8 py-3 rounded-full font-bold hover:bg-yellow-500 hover:text-purple-900 transition-all">Back to Home</a>
          </div>
        )}
      </div>
    </div>
  )
}