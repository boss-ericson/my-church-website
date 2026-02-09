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
      <body suppressHydrationWarning className="bg-white text-black antialiased overflow-x-hidden">
        
        {/* --- RESPONSIVE NAVIGATION BAR --- */}
        <nav className="bg-white border-b-2 border-yellow-500 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto">
            
            {/* TOP SECTION: LOGO & BRANDING */}
            <div className="px-4 py-3 flex items-center justify-between md:justify-start md:gap-6">
              <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-all">
                {/* Logo - Sized perfectly for mobile vs desktop */}
                <div className="w-12 h-12 md:w-20 md:h-20 bg-purple-900 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-yellow-500 shadow-lg">
                  <img 
                    src="/logo.png" 
                    alt="GOT Logo" 
                    className="w-full h-full object-contain p-1.5 md:p-2" 
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150/4c1d95/eab308?text=GOT';
                    }} 
                  />
                </div>
                
                {/* Church Name - Specifically fixed for mobile visibility */}
                <div className="flex flex-col justify-center">
                  <h1 className="font-black text-[15px] md:text-2xl text-purple-900 leading-tight uppercase tracking-tighter">
                    Glorious <span className="block sm:inline">Overflowing</span>
                  </h1>
                  <span className="text-yellow-600 font-bold text-[10px] md:text-sm tracking-[0.15em] uppercase leading-none">
                    Testimonies
                  </span>
                </div>
              </a>

              {/* Mobile Status Indicator (Subtle Red Dot) */}
              <div className="md:hidden flex items-center gap-2 px-2 py-1 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-purple-900 uppercase">Live</span>
              </div>
            </div>

            {/* BOTTOM SECTION: NAVIGATION LINKS */}
            {/* On mobile, this becomes a horizontal scrolling menu so links never squash */}
            <div className="border-t border-gray-100 md:border-none">
              <div className="flex items-center justify-start md:justify-center gap-6 px-4 py-3 overflow-x-auto no-scrollbar scroll-smooth">
                <a href="/" className="text-[11px] md:text-xs font-black uppercase tracking-widest text-purple-900 hover:text-yellow-600 transition whitespace-nowrap">Home</a>
                <a href="/live" className="text-[11px] md:text-xs font-black uppercase tracking-widest text-purple-900 hover:text-yellow-600 transition whitespace-nowrap">Live</a>
                <a href="/testimonies" className="text-[11px] md:text-xs font-black uppercase tracking-widest text-purple-900 hover:text-yellow-600 transition whitespace-nowrap">Testimonies</a>
                <a href="/shop" className="text-[11px] md:text-xs font-black uppercase tracking-widest text-purple-900 hover:text-yellow-600 transition whitespace-nowrap">Shop</a>
                <a href="/sermons" className="text-[11px] md:text-xs font-black uppercase tracking-widest text-purple-900 hover:text-yellow-600 transition whitespace-nowrap">Sermons</a>
                <a href="/contact" className="text-[11px] md:text-xs font-black uppercase tracking-widest text-purple-900 hover:text-yellow-600 transition whitespace-nowrap">Contact</a>
              </div>
            </div>
          </div>
        </nav>

        {/* --- MAIN PAGE CONTENT --- */}
        <main className="min-h-screen">
          {children}
        </main>

        <WhatsAppButton />

        {/* --- MOBILE-FRIENDLY FOOTER --- */}
        <footer className="bg-purple-950 text-white py-12 px-6 mt-10 border-t-8 border-yellow-500">
          <div className="max-w-7xl mx-auto text-center">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-yellow-500/50 mx-auto mb-6">
              <span className="text-yellow-500 font-bold text-[10px]">GOT</span>
            </div>
            
            <p className="font-black text-yellow-500 mb-2 uppercase tracking-widest text-lg md:text-xl">
              Glorious Overflowing Testimonies
            </p>
            <p className="text-xs md:text-sm text-purple-200 opacity-70 mb-8 italic max-w-sm mx-auto">
              "Shouting His Praise, Sharing Our Stories."
            </p>
            
            <div className="h-px w-20 bg-purple-800 mx-auto mb-8"></div>
            
            <p className="text-[10px] text-purple-300 opacity-40 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
