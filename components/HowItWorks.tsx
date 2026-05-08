import React from 'react';
import { UploadCloud, Palette, Wand2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: UploadCloud,
      title: "Fotoğrafını Yükle",
      description: "Yenilemek istediğiniz odanın net bir fotoğrafını çekin veya yükleyin."
    },
    {
      icon: Palette,
      title: "Tarzını Seç",
      description: "Modern, İskandinav, Endüstriyel ve daha fazlası arasından seçim yapın."
    },
    {
      icon: Wand2,
      title: "Yapay Zeka ile Dönüştür",
      description: "Saniyeler içinde odanızın tamamen yeni bir görünüm kazanmasını izleyin."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-gold-600 font-bold tracking-wide uppercase text-sm mb-2">Süreç</h2>
          <p className="text-4xl font-extrabold text-navy-900">
            Nasıl Çalışır?
          </p>
          <p className="mt-4 max-w-2xl text-lg text-slate-500 mx-auto">
            Hayalinizdeki eve ulaşmak için sadece 3 basit adım.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gold-100 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-white border-4 border-gold-50 flex items-center justify-center text-gold-600 mb-8 shadow-lg group-hover:scale-110 group-hover:border-gold-100 transition-all duration-300">
                <step.icon size={40} strokeWidth={1.5} />
              </div>
              <div className="bg-gold-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4 text-sm">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};