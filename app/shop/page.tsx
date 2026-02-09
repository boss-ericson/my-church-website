import { supabase } from '@/lib/supabase'
export const dynamic = 'force-dynamic';
export default async function ShopPage() {
  // Fetch products from Supabase
  const { data: products } = await supabase.from('products').select('*')

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-black mb-2">Church Bookstore & Shop</h1>
          <p className="text-gray-600 text-lg">Resources to help you grow in your faith.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((item) => (
            <div key={item.id} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="object-cover w-full h-full" />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <span className="text-xs font-bold text-blue-600 uppercase">{item.category}</span>
                <h3 className="text-xl font-bold text-black mt-1">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>
                
                <div className="mt-auto pt-5 flex items-center justify-between">
                  <span className="text-2xl font-black text-black">${item.price}</span>
                  <a 
  href={`https://wa.me/233XXXXXXXXX?text=Hello GOT Shop, I want to purchase: ${item.name}`}
  className="bg-purple-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-500 hover:text-purple-900 shadow-md transition-all"
>
  ORDER NOW
</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

}
