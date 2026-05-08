import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Nasıl Çalışır?', href: '#how-it-works' },
    { name: 'Özellikler', href: '#features' },
    { name: 'SSS', href: '#faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      // Calculate offset for fixed header
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsOpen(false);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
            <div className="flex items-center gap-2">
              <span className="font-['Cormorant_Garamond'] text-3xl font-semibold text-slate-800 tracking-wide uppercase">Yör</span>
              <div className="h-8 w-[1.5px] bg-gold-600" />
              <span className="font-['Inter'] text-sm font-light tracking-[0.3em] text-slate-500 uppercase mt-1 ml-1">Palas</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-slate-600 hover:text-gold-600 font-medium transition-colors text-sm cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="#design-tool" 
              onClick={(e) => handleNavClick(e, '#design-tool')}
              className="bg-gold-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-700 transition-all shadow-lg shadow-gold-100 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Ücretsiz Tasarla
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-gold-600 focus:outline-none p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl md:hidden animate-in slide-in-from-top-5">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block text-slate-600 hover:text-gold-600 hover:bg-gold-50 px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3">
              <a 
                href="#design-tool" 
                onClick={(e) => handleNavClick(e, '#design-tool')}
                className="block w-full text-center bg-gold-600 text-white px-5 py-3 rounded-xl text-base font-bold shadow-md cursor-pointer"
              >
                Hemen Tasarla
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};