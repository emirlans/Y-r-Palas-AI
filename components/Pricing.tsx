import React from 'react';
import { Check } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gold-600 font-bold tracking-wide uppercase text-sm mb-2">Fiyatlandırma</h2>
          <p className="text-4xl font-extrabold text-navy-900">
            Her İhtiyaca Uygun Planlar
          </p>
          <p className="mt-4 max-w-2xl text-lg text-slate-500 mx-auto">
            İster tek bir oda, ister tüm evinizi tasarlayın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 relative">
            <h3 className="text-xl font-bold text-navy-900">Başlangıç</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-navy-900">0₺</span>
              <span className="ml-1 text-slate-500">/ay</span>
            </div>
            <p className="mt-4 text-slate-500 text-sm">Yapay zekayı denemek isteyenler için.</p>
            <a href="#design-tool" className="mt-8 block w-full bg-slate-100 text-navy-900 font-bold py-3 px-4 rounded-xl text-center hover:bg-slate-200 transition-colors">
              Ücretsiz Dene
            </a>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-sm text-slate-600">
                <Check size={18} className="text-gold-600 mr-3 flex-shrink-0" />
                3 Ücretsiz Render
              </li>
              <li className="flex items-center text-sm text-slate-600">
                <Check size={18} className="text-gold-600 mr-3 flex-shrink-0" />
                Standart Kalite
              </li>
              <li className="flex items-center text-sm text-slate-600">
                <Check size={18} className="text-gold-600 mr-3 flex-shrink-0" />
                Filigranlı Çıktılar
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-navy-900 rounded-2xl shadow-xl p-8 border border-slate-800 relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-gold-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
              POPÜLER
            </div>
            <h3 className="text-xl font-bold text-white">Pro</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-white">299₺</span>
              <span className="ml-1 text-slate-400">/ay</span>
            </div>
            <p className="mt-4 text-slate-400 text-sm">Evini yenileyenler ve emlakçılar için.</p>
            <button className="mt-8 block w-full bg-gold-600 text-white font-bold py-3 px-4 rounded-xl text-center hover:bg-gold-700 transition-colors shadow-lg shadow-gold-900/20">
              Hemen Başla
            </button>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-sm text-slate-300">
                <Check size={18} className="text-gold-400 mr-3 flex-shrink-0" />
                100 Render / Ay
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <Check size={18} className="text-gold-400 mr-3 flex-shrink-0" />
                4K Ultra HD Kalite
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <Check size={18} className="text-gold-400 mr-3 flex-shrink-0" />
                Filigransız
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <Check size={18} className="text-gold-400 mr-3 flex-shrink-0" />
                Öncelikli İşleme
              </li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 relative">
            <h3 className="text-xl font-bold text-navy-900">Ajans</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-navy-900">999₺</span>
              <span className="ml-1 text-slate-500">/ay</span>
            </div>
            <p className="mt-4 text-slate-500 text-sm">Mimarlık ofisleri ve büyük projeler için.</p>
            <button className="mt-8 block w-full bg-slate-100 text-navy-900 font-bold py-3 px-4 rounded-xl text-center hover:bg-slate-200 transition-colors">
              İletişime Geç
            </button>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-sm text-slate-600">
                <Check size={18} className="text-gold-600 mr-3 flex-shrink-0" />
                Sınırsız Render
              </li>
              <li className="flex items-center text-sm text-slate-600">
                <Check size={18} className="text-gold-600 mr-3 flex-shrink-0" />
                API Erişimi
              </li>
              <li className="flex items-center text-sm text-slate-600">
                <Check size={18} className="text-gold-600 mr-3 flex-shrink-0" />
                Özel Destek Hattı
              </li>
              <li className="flex items-center text-sm text-slate-600">
                <Check size={18} className="text-gold-600 mr-3 flex-shrink-0" />
                Ekip Yönetimi
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};