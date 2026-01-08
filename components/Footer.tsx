
import React from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy border-t-4 border-brand-gold text-white pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6 text-brand-gold">
              <span className="material-symbols-outlined text-3xl">waves</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">Urban Tide</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Referência em moda masculina premium. Trazendo o melhor do algodão peruano para o seu estilo.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/urbantide" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-navy transition-colors">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </a>
              <a href="https://facebook.com/urbantide" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-navy transition-colors">
                <span className="material-symbols-outlined text-xl">thumb_up</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-brand-gold uppercase tracking-wider text-sm">Categorias</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/catalog" className="hover:text-white transition-colors">Lançamentos</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Camisas Polo</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Camisetas Básicas</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Kits Promocionais</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-brand-gold uppercase tracking-wider text-sm">Ajuda</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/checkout" className="hover:text-white transition-colors">Como comprar</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Guia de Tamanhos</Link></li>
              <li><Link to="/policies" className="hover:text-white transition-colors">Política de Trocas</Link></li>
              <li><Link to="/policies" className="hover:text-white transition-colors">Prazos de Entrega</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-brand-gold uppercase tracking-wider text-sm">Contato</h3>
            <div className="flex flex-col gap-4">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-green-500">chat</span>
                <span className="text-sm font-medium">(11) 99158-3540</span>
              </a>
              <a href="mailto:contato@urbantide.com.br" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <span className="material-symbols-outlined">mail</span>
                <span className="text-sm font-medium">contato@urbantide.com.br</span>
              </a>
              <p className="text-gray-500 text-xs mt-4">Atendimento de Seg. a Sex. das 9h às 18h.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">© 2026 Urban Tide. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-gray-500 text-2xl" title="Pagamento Seguro">lock</span>
            <span className="material-symbols-outlined text-gray-500 text-2xl" title="PIX">payments</span>
            <span className="material-symbols-outlined text-gray-500 text-2xl" title="Cartão de Crédito">credit_card</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
