import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeLine, setActiveLine] = useState<'feminino' | 'masculino'>('masculino');

  const slides = [
    {
      image: "/hero_masculine.png",
      title: "URBAN TIDE | 2026",
      highlight: "CONCEITO PREMIUM",
      description: "Do casual ao surfwear de luxo. Polos de algodão pima e camisas de grife para o homem moderno.",
      badge: "NOVA COLEÇÃO"
    },
    {
      image: "/hero_feminine.jpg",
      title: "ESSENCIAL",
      highlight: "FEMININO CHIC",
      description: "Baby looks exclusivas e peças de grife com o caimento perfeito. Sofisticação urbana em cada fibra.",
      badge: "LANÇAMENTO",
      position: "center 20%" // Focus on the blouse
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
                  transform: currentSlide === index ? 'scale(1.05)' : 'scale(1.0)', // Subtle zoom effect
                  backgroundPosition: (slide as any).position || 'center'
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

      {/* Promo Banner Section */}
      <section className="relative overflow-hidden group py-10 md:py-24">
        {/* Background Image with Parallax-like effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] group-hover:scale-110"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(13, 19, 27, 0.8) 0%, rgba(13, 19, 27, 0.2) 100%), url("/banner_promo_v10.jpg")`,
            backgroundPosition: 'center 30%'
          }}
        ></div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-10 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
              <span className="bg-brand-gold text-brand-navy text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter mb-6 animate-pulse shadow-lg shadow-brand-gold/20">Oferta Limitada</span>
              <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">
                TODO O SITE COM <span className="gold-gradient-text">20% OFF</span>
              </h2>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-sm">Roupas premium de fio 30.1/40.1 de extrema qualidade</p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6 shrink-0">
              <div className="bg-black/40 border-2 border-dashed border-brand-gold/50 px-10 py-6 rounded-2xl flex flex-col items-center group-hover:border-brand-gold transition-colors shadow-2xl">
                <span className="text-[10px] text-gray-500 font-black uppercase mb-2 tracking-widest">RESGATE O CUPOM:</span>
                <span className="text-3xl md:text-4xl font-black text-brand-gold tracking-[0.3em] drop-shadow-lg scale-110">URBAN20</span>
              </div>
              <Link to="/catalog" className="w-full sm:w-auto px-12 py-4 bg-brand-gold text-brand-navy font-black rounded-xl hover:scale-105 hover:bg-white transition-all shadow-2xl shadow-brand-gold/20 uppercase text-sm tracking-widest">
                GARANTIR DESCONTO
              </Link>
            </div>
          </div>
        </div>
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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
          <div className="flex justify-center mb-10">
            <div className="bg-white p-1 rounded-xl shadow-inner border border-gray-200 flex gap-1">
              <button
                onClick={() => setActiveLine('masculino')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeLine === 'masculino' ? 'bg-brand-navy text-white shadow-lg' : 'text-gray-500 hover:text-brand-navy hover:bg-gray-50'}`}
              >
                MASCULINO <span className="text-[10px] ml-1 opacity-60">EXCLUSIVE</span>
              </button>
              <button
                onClick={() => setActiveLine('feminino')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeLine === 'feminino' ? 'bg-brand-navy text-white shadow-lg' : 'text-gray-500 hover:text-brand-navy hover:bg-gray-50'}`}
              >
                FEMININO <span className="text-[10px] ml-1 opacity-60">EXCLUSIVE</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[450px] rounded-2xl overflow-hidden group shadow-xl border-2 border-brand-gold bg-brand-navy">
              {/* Transitioning backgrounds */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${activeLine === 'masculino' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                style={{ backgroundImage: 'url("/men_fashion_banner.jpg")' }}
              ></div>
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${activeLine === 'feminino' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                style={{ backgroundImage: 'url("/women_fashion_banner.jpg")' }}
              ></div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-2 transition-all duration-500 translate-y-0 opacity-100">
                  Coleção 2026
                </span>
                <h3 className="text-white text-3xl font-bold mb-2 transition-all duration-500">
                  {activeLine === 'masculino' ? 'Linha Masculina Exclusive' : 'Linha Feminina Exclusive'}
                </h3>
                <p className="text-gray-200 mb-6 max-w-sm transition-all duration-500">
                  {activeLine === 'masculino'
                    ? 'O ápice da moda masculina. Peças selecionadas com corte impecável e materiais nobres.'
                    : 'Elegância e sofisticação em cada detalhe. Conheça nossa nova coleção exclusiva.'}
                </p>
                <Link
                  to={activeLine === 'masculino' ? '/catalog?gender=Masculino' : '/catalog?gender=Feminino'}
                  className="self-start px-8 py-3 bg-brand-gold text-brand-navy font-black rounded-lg hover:scale-105 transition-all shadow-lg uppercase"
                >
                  VER COLEÇÃO {activeLine === 'masculino' ? 'MASCULINA' : 'FEMININA'}
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-gold/30 transition-colors group">
                <span className="material-symbols-outlined text-brand-gold text-4xl mb-4 group-hover:scale-110 transition-transform block w-fit">straighten</span>
                <h3 className="text-2xl font-bold text-brand-navy mb-3">Guia de Medidas</h3>
                <p className="text-gray-500 mb-6 font-light">Confira nossa tabela detalhada para encontrar o caimento perfeito em todas as nossas linhas.</p>
                <Link to="/size-guide" className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all group-hover:text-blue-700">
                  Acessar Tabela de Tamanhos <span className="material-symbols-outlined ml-1">arrow_forward</span>
                </Link>
              </div>

              <div className="bg-brand-navy p-8 rounded-2xl shadow-sm border border-brand-gold/30 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                <span className="material-symbols-outlined text-brand-gold text-4xl mb-4 relative z-10">support_agent</span>
                <h3 className="text-2xl font-bold mb-3 relative z-10">Atendimento VIP</h3>
                <p className="text-gray-300 mb-6 font-light relative z-10">Fale com um de nossos consultores especializados para uma experiência de compra personalizada.</p>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="inline-flex items-center text-brand-gold font-bold hover:text-white transition-all relative z-10 group-hover:gap-2">
                  Falar com Consultor <span className="material-symbols-outlined ml-1">chat</span>
                </a>
              </div>
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
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">URBAN TIDE <span className="gold-gradient-text">EXCLUSIVE</span></h2>
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
