
import React from 'react';
import { WHATSAPP_NUMBER } from '../constants';

const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-brand-green text-white px-5 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 hover:scale-110 hover:bg-[#20bd5a] transition-all group animate-bounce"
      style={{ animationDuration: '3s' }}
    >
      <span className="font-bold text-xs uppercase tracking-widest hidden sm:block">Fazer pedido</span>
      <div className="bg-white/20 p-1.5 rounded-full shadow-inner">
        <span className="material-symbols-outlined text-2xl">chat</span>
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
