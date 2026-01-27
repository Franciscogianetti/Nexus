import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const slides = [
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9mZow8h25qP6HBmsjk01E51obKPLjest_6Cxv7GmSZ0bQe9x9xCy6ikKgZfWmHh0sGxwvfePJQ0I7vTpkYX1Uy-qpx73qyVb8ayunFaH4p5GfvxBIzQtzpBMuwgxb9aRx1JyyEp8S6zs398y-BWiMckxvGkyfum5mCoLtawd12ewAJQcPkWKPzRg9xzQ1CnvtA9VYUFi3tFQ-0O7tf-XiFkIfLDsUPlCWyU6jGByaJ28Hg30BZuuNKY36M7788a0KNBhwOmPfuO8",
      title: "COLEÇÃO | 2026",
      highlight: "URBAN TIDE PREMIUM",
      description: "Experimente o máximo conforto e elegância com nossas novas polos de algodão pima peruano.",
      badge: "LANÇAMENTO"
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9mZow8h25qP6HBmsjk01E51obKPLjest_6Cxv7GmSZ0bQe9x9xCy6ikKgZfWmHh0sGxwvfePJQ0I7vTpkYX1Uy-qpx73qyVb8ayunFaH4p5GfvxBIzQtzpBMuwgxb9aRx1JyyEp8S6zs398y-BWiMckxvGkyfum5mCoLtawd12ewAJQcPkWKPzRg9xzQ1CnvtA9VYUFi3tFQ-0O7tf-XiFkIfLDsUPlCWyU6jGByaJ28Hg30BZuuNKY36M7788a0KNBhwOmPfuO8", // Placeholder, ideally specific images per slide
      title: "CLÁSSICOS",
      highlight: "ATEMPORAIS",
      description: "Peças essenciais que nunca saem de moda. Qualidade e durabilidade para o seu dia a dia.",
      badge: "BEST SELLERS"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (data) {
        setFeaturedProducts(data);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Slider */}
      <section className="relative w-full h-[600px] bg-brand-navy overflow-hidden group">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 z-0">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
                style={{
                  backgroundImage: `linear-gradient(rgba(13, 19, 27, 0.4) 0%, rgba(13, 19, 27, 0.8) 100%), url("${slide.image}")`,
                  transform: currentSlide === index ? 'scale(1.05)' : 'scale(1.0)' // Subtle zoom effect
                }}
              ></div>
            </div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
              <span className={`inline-block py-1 px-3 rounded-full bg-brand-gold/20 border border-brand-gold text-brand-gold text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm transition-all duration-700 delay-300 ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {slide.badge}
              </span>
              <h1 className={`text-white text-5xl md:text-7xl font-black leading-tight tracking-tight mb-4 drop-shadow-lg transition-all duration-700 delay-500 ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {slide.title} <br />
                <span className="gold-gradient-text">{slide.highlight}</span>
              </h1>
              <p className={`text-gray-200 text-lg md:text-xl font-light mb-10 max-w-2xl leading-relaxed transition-all duration-700 delay-700 ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {slide.description}
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 w-full justify-center transition-all duration-700 delay-900 ${currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Link to="/catalog" className="flex items-center justify-center h-14 px-8 rounded-lg bg-primary hover:bg-blue-700 text-white text-base font-bold shadow-xl shadow-blue-900/20 transition-all transform hover:-translate-y-1">
                  Ver Coleção Completa
                </Link>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="flex items-center justify-center h-14 px-8 rounded-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-navy text-base font-bold transition-all">
                  <span className="material-symbols-outlined mr-2">chat</span>
                  Atendimento VIP
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8 bg-brand-gold' : 'w-2 bg-white/30 hover:bg-white/50'}`}
              aria-label={`Ir para slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Arrow Navigation (Optional but good for UX) */}
        <button
          onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="size-12 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </div>
              <div>
                <h3 className="text-brand-navy font-bold text-lg mb-1">Envio para todo o Brasil</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Entrega rápida, segura e com código de rastreio.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="size-12 rounded-full bg-green-50 text-brand-green flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">chat</span>
              </div>
              <div>
                <h3 className="text-brand-navy font-bold text-lg mb-1">Pedido via WhatsApp</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Atendimento humano e personalizado para tirar suas dúvidas.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="size-12 rounded-full bg-yellow-50 text-yellow-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">workspace_premium</span>
              </div>
              <div>
                <h3 className="text-brand-navy font-bold text-lg mb-1">Qualidade Garantida</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Tecido Fio 40.1 Penteado. Não encolhe e não desbota.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-10 py-16 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <div>
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Novidades</span>
            <h2 className="text-brand-navy text-3xl font-bold tracking-tight">Lançamentos da Semana</h2>
          </div>
          <Link to="/catalog" className="text-primary font-bold hover:underline flex items-center">
            Ver todos <span className="material-symbols-outlined text-sm ml-1">arrow_forward_ios</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Featured Banner Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[450px] rounded-2xl overflow-hidden group shadow-lg border-2 border-brand-gold">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url("/women_fashion_banner.jpg")' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Coleção 2026</span>
              <h3 className="text-white text-3xl font-bold mb-2">Linha Feminina Exclusive</h3>
              <p className="text-gray-200 mb-6 max-w-sm">Elegância e sofisticação em cada detalhe. Conheça nossa nova coleção exclusiva.</p>
              <Link to="/catalog?gender=Feminino" className="self-start px-8 py-3 bg-brand-gold text-brand-navy font-black rounded-lg hover:scale-105 transition-all shadow-lg">
                VER COLEÇÃO FEMININA
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <span className="material-symbols-outlined text-brand-gold text-4xl mb-4">straighten</span>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Guia de Medidas</h3>
              <p className="text-gray-500 mb-6">Confira nossa tabela detalhada para encontrar o caimento perfeito em todas as nossas linhas.</p>
              <Link to="/size-guide" className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all">
                Acessar Tabela de Tamanhos <span className="material-symbols-outlined ml-1">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-brand-navy p-8 rounded-2xl shadow-sm border border-brand-gold/30 text-white">
              <span className="material-symbols-outlined text-brand-gold text-4xl mb-4">support_agent</span>
              <h3 className="text-2xl font-bold mb-3">Atendimento VIP</h3>
              <p className="text-gray-300 mb-6">Fale com um de nossos consultores especializados para uma experiência de compra personalizada.</p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="inline-flex items-center text-brand-gold font-bold hover:text-white transition-all">
                Falar com Consultor <span className="material-symbols-outlined ml-1">chat</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
          <div className="bg-brand-navy rounded-3xl overflow-hidden relative min-h-[400px] border-b-4 border-brand-gold shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573167243872-43c6433b9d40?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-10 text-center">
              <span className="text-brand-gold font-bold tracking-[0.3em] text-xs uppercase mb-4">Comunidade Privada</span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">FINOTRATO <span className="gold-gradient-text">EXCLUSIVE</span></h2>
              <p className="text-gray-300 mb-10 max-w-xl text-lg md:text-xl font-light leading-relaxed">
                Participe do nosso grupo VIP e receba lançamentos antecipados, promoções relâmpago e conteúdo exclusivo de moda.
              </p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="group px-12 py-5 bg-brand-gold text-brand-navy font-black rounded-xl hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                <span className="material-symbols-outlined font-bold">group_add</span>
                ENTRAR NO GRUPO VIP
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
