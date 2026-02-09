'use client'

import "./globals.css";
import WhatsAppButton from "../components/WhatsAppButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-white text-black antialiased">
        
        {/* --- NAVIGATION BAR --- */}
        <nav className="bg-white border-b-2 border-yellow-500 p-2 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
            
            {/* LOGO & CHURCH NAME SECTION */}
            <a href="/" className="flex items-center gap-4 hover:opacity-90 transition-all py-1">
              
              {/* Logo Circle Container */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-900 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-yellow-500 shadow-xl relative">
                <img 
                  src="/logo.png" 
                  alt="Glorious Overflowing Testimonies Logo" 
                  className="w-full h-full object-contain p-2" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150/4c1d95/eab308?text=GOT';
                  }} 
                />
              </div>
              
              {/* Branding Text */}
              <div className="hidden sm:block">
                <h1 className="font-black text-lg md:text-xl text-purple-900 leading-none uppercase tracking-tighter">
                  Glorious Overflowing
                </h1>
                <span className="text-yellow-600 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
                  Testimonies
                </span>
              </div>
            </a>
            
            {/* --- PUBLIC NAV LINKS --- */}
            <div className="flex items-center gap-3 md:gap-6 text-[10px] md:text-xs font-black uppercase tracking-widest">
              <a href="/" className="text-purple-900 hover:text-yellow-600 transition">Home</a>
              <a href="/live" className="text-purple-900 hover:text-yellow-600 transition">Live</a>
              {/* New Testimonies Link */}
              <a href="/testimonies" className="text-purple-900 hover:text-yellow-600 transition">Testimonies</a>
              <a href="/shop" className="text-purple-900 hover:text-yellow-600 transition text-nowrap">Shop</a>
              <a href="/sermons" className="text-purple-900 hover:text-yellow-600 transition text-nowrap">Sermons</a>
              <a href="/contact" className="text-purple-900 hover:text-yellow-600 transition">Contact</a>
            </div>
          </div>
        </nav>

        {/* --- MAIN PAGE CONTENT --- */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* --- GLOBAL COMPONENTS --- */}
        <WhatsAppButton />

        {/* --- FOOTER --- */}
        <footer className="bg-purple-950 text-white py-12 px-8 mt-20 border-t-8 border-yellow-500">
          <div className="max-w-7xl mx-auto text-center">
            {/* Small decorative logo for footer */}
            <div className="flex justify-center mb-6">
               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-yellow-500/50 shadow-lg">
                  <span className="text-yellow-500 font-bold text-xs uppercase">GOT</span>
               </div>
            </div>
            
            <p className="font-black text-yellow-500 mb-2 uppercase tracking-widest text-lg">
              Glorious Overflowing Testimonies
            </p>
            <p className="text-sm text-purple-200 opacity-70 mb-6 italic max-w-md mx-auto">
              "Shouting His Praise, Sharing Our Stories."
            </p>
            
            <div className="h-px w-full bg-purple-800/30 mb-6"></div>
            
            <p className="text-[10px] md:text-xs text-purple-300 opacity-50 uppercase tracking-widest">
              © {new Date().getFullYear()} All Rights Reserved. Faith • Worship • Testimony
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}