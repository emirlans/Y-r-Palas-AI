import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          <span className="text-navy-900">Neden</span> <span className="text-gold-600">Yörpalas AI?</span>
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
          İç mimar masraflarını unutun. Odanızın fotoğrafını yükleyin ve yapay zekamızın 
          sizin için 30'dan fazla farklı tarzda dekorasyon önerisi oluşturmasını izleyin.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-slate-500 font-medium mb-12">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" />
            <span>Kredi Kartı Gerekmez</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" />
            <span>30+ Tasarım Tarzı</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" />
            <span>Hızlı ve Gerçekçi</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="#how-it-works" 
            onClick={(e) => handleScroll(e, 'how-it-works')}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            Nasıl Çalışır?
          </a>
        </div>

        {/* Informational Image */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-slate-100">
           <img 
             src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop" 
             alt="Modern Living Room" 
             className="w-full h-auto object-cover"
           />
           <div className="absolute inset-0 bg-black/10" />
           <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
              <p className="font-bold text-slate-900">Modern Oturma Odası</p>
              <p className="text-xs text-slate-500">Yapay Zeka Tarafından Oluşturuldu</p>
           </div>
        </div>
      </div>
    </section>
  );
};