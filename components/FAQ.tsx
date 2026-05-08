import React from 'react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "Ücretli mi?",
      a: "Hayır! Yörpalas AI tamamen ücretsizdir. Dilediğiniz kadar tasarım yapabilir ve indirebilirsiniz."
    },
    {
      q: "Fotoğraflarım ne kadar süre saklanıyor?",
      a: "Gizliliğiniz bizim için önemlidir. Yüklediğiniz fotoğraflar işlem tamamlandıktan sonra güvenli bir şekilde sunucularımızdan silinir."
    },
    {
      q: "Hangi dosya formatlarını destekliyorsunuz?",
      a: "Şu anda JPG, PNG ve WEBP formatlarını destekliyoruz. En iyi sonuç için aydınlık ve geniş açılı fotoğraflar öneririz."
    },
    {
      q: "Çıktıları ticari amaçla kullanabilir miyim?",
      a: "Evet, Yörpalas AI ile oluşturduğunuz tüm görselleri emlak ilanlarınızda, sunumlarınızda veya portföyünüzde ücretsiz olarak kullanabilirsiniz."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-navy-900">Sıkça Sorulan Sorular</h2>
        </div>
        
        <div className="space-y-6">
          {faqs.map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors border border-transparent hover:border-gold-100">
              <h3 className="text-lg font-bold text-navy-900 mb-2">{item.q}</h3>
              <p className="text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};