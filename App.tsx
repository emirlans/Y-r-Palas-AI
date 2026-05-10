import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { DesignTool } from './components/DesignTool';
import { FAQ } from './components/FAQ';
import { ChatAssistant } from './components/ChatAssistant';
import { Check, Zap, Smartphone, Layout } from 'lucide-react';

function App() {
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio && aistudio.hasSelectedApiKey) {
        try {
          const hasKey = await aistudio.hasSelectedApiKey();
          if (hasKey) {
            setApiKeyReady(true);
          } else {
            setNeedsKey(true);
          }
        } catch (e) {
          console.error("Error checking API key:", e);
          setApiKeyReady(true);
        }
      } else {
        setApiKeyReady(true);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && aistudio.openSelectKey) {
      try {
        await aistudio.openSelectKey();
        setApiKeyReady(true);
        setNeedsKey(false);
      } catch (e) {
        console.error("Error selecting API key:", e);
      }
    }
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (!apiKeyReady && needsKey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Yörpalas AI'a Hoş Geldiniz</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Bu uygulama Veo video oluşturma ve yüksek çözünürlüklü imaj oluşturma yeteneklerini kullanır. Özelliklere erişmek için kendi API anahtarınızı seçmeniz gerekmektedir.
            </p>
            <p className="text-sm text-slate-500 mb-8 border-t border-slate-100 pt-4">
              Ücretlendirme detayları için <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-gold-600 hover:underline">faturalandırma dokümantasyonunu</a> inceleyebilirsiniz.
            </p>
            <button onClick={handleSelectKey} className="bg-gold-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gold-700 transition w-full shadow-lg shadow-gold-100">
              API Anahtarı Seç
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      
      <main>
        {/* DesignTool is now the Hero / First Screen */}
        <DesignTool />
        
        <HowItWorks />

        {/* Original Hero moved down as an informational section */}
        <Hero />
        
        {/* Features Section */}
        <section id="features" className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Özellikler</h2>
              <p className="text-slate-500 mt-2">Profesyonel sonuçlar için ihtiyacınız olan her şey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { icon: Zap, title: "Yüksek Hız", desc: "Flash Lite ile anında render." },
                 { icon: Layout, title: "30+ Stil", desc: "Imagen 4 ile sınırsız varyasyon." },
                 { icon: Smartphone, title: "Video Turu", desc: "Veo ile odanızı canlandırın." },
                 { icon: Check, title: "HD Kalite", desc: "Baskıya uygun yüksek çözünürlük." },
               ].map((f, i) => (
                 <div key={i} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group">
                    <f.icon className="text-gold-600 mb-4 transition-transform group-hover:scale-110" size={32} />
                    <h3 className="font-bold text-lg mb-2 text-slate-800">{f.title}</h3>
                    <p className="text-sm text-slate-500">{f.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        <FAQ />
        
        {/* AI Assistant */}
        <ChatAssistant />
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-['Cormorant_Garamond'] text-2xl font-semibold text-white tracking-wide uppercase">Yör</span>
                <div className="h-6 w-[1px] bg-gold-600" />
                <span className="font-['Inter'] text-xs font-light tracking-[0.2em] text-slate-400 uppercase mt-1 ml-1">Palas</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Yapay zeka destekli iç mekan tasarımı ile yaşam alanlarınızı dönüştürün. 
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="hover:text-white transition cursor-pointer">Nasıl Çalışır?</a></li>
              <li><a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-white transition cursor-pointer">Özellikler</a></li>
              <li><a href="#design-tool" onClick={(e) => handleScroll(e, 'design-tool')} className="hover:text-white transition cursor-pointer">Tasarla</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Destek</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="hover:text-white transition cursor-pointer">Yardım Merkezi</a></li>
              <li><a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="hover:text-white transition cursor-pointer">Sıkça Sorulan Sorular</a></li>
              <li><a href="mailto:destek@yorpalas.com" className="hover:text-white transition">İletişim</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Yasal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition" onClick={(e) => e.preventDefault()}>Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-white transition" onClick={(e) => e.preventDefault()}>Kullanım Şartları</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 text-center text-sm">
          &copy; {new Date().getFullYear()} Yörpalas. İstanbul'da ❤️ ile yapıldı.
        </div>
      </footer>
    </div>
  );
}

export default App;