import { supabase } from '@/lib/supabase'

export default async function SermonsPage() {
  const { data: sermons } = await supabase.from('sermons').select('*').order('published_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-purple-900 text-white py-12 px-8 mb-12 border-b-4 border-yellow-500">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black uppercase">Sermon <span className="text-yellow-500">Archive</span></h1>
          <p className="text-purple-200 italic">"Faith comes by hearing, and hearing by the Word of God."</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {sermons?.map((sermon) => (
          <div key={sermon.id} className="bg-white rounded-2xl shadow-lg border-b-4 border-purple-900 overflow-hidden hover:-translate-y-2 transition-transform">
            <div className="aspect-video bg-black">
              <iframe width="100%" height="100%" src={sermon.video_url} className="border-0" allowFullScreen></iframe>
            </div>
            <div className="p-6">
              <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-1 rounded uppercase">{sermon.series || 'Message'}</span>
              <h3 className="text-xl font-bold text-purple-900 mt-2 mb-1">{sermon.title}</h3>
              <p className="text-gray-700 font-medium">Preached by: <span className="text-purple-700 font-bold">{sermon.speaker}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}