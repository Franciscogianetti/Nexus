
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../constants';

const Checkout: React.FC = () => {
  const [coupon, setCoupon] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [error, setError] = useState('');

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'URBAN20') {
      setIsApplied(true);
      setError('');
    } else {
      setIsApplied(false);
      setError('Cupom inválido.');
    }
  };

  const messageTemplate = `Olá, Urban Tide!

Gostaria de fazer o seguinte pedido:
1x Polo Navy Premium - Tamanho G (REF: FT-001)
1x T-Shirt White Basic - Tamanho M (REF: FT-002)

CEP de entrega: 00000-000
Forma de pagamento: PIX

${isApplied ? '🎟️ CUPOM APLICADO: URBAN20 (20% OFF)\n🔐 Protocolo de Segurança: UT-2026-VERIFIED' : ''}
`;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-12 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col gap-12">
        <div className="text-center flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase italic">Realizar Pedido</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Escolha seus modelos favoritos no catálogo e finalize o pedido de forma rápida diretamente com nosso atendimento pelo WhatsApp.
          </p>
        </div>

        {/* Coupon Section */}
        <div className="bg-brand-navy/30 p-6 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-gold">local_offer</span>
            Tem um cupom de desconto?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Digite seu cupom aqui"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="flex-grow px-4 py-3 bg-black/20 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-gold uppercase font-bold text-white placeholder:text-gray-600"
            />
            <button
              onClick={handleApplyCoupon}
              className="btn-aplicar px-8 py-3 rounded-xl font-black hover:bg-white transition-all shadow-lg"
              style={{ backgroundColor: '#c5a059 !important', color: '#0d131b !important' }}
            >
              APLICAR AGORA
            </button>
          </div>
          {isApplied && (
            <div className="mt-4 p-3 bg-green-900/20 text-green-500 border border-green-500/20 rounded-lg flex items-center gap-2 font-bold animate-pulse text-sm">
              <span className="material-symbols-outlined">check_circle</span>
              Cupom URBAN20 aplicado com sucesso! 20% de desconto garantido no valor final.
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 font-bold text-sm">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-8 bg-brand-navy/30 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl transition-all hover:border-white/10">
            <div className="size-16 rounded-full bg-white/5 text-brand-gold flex items-center justify-center mb-6 border border-white/10">
              <span className="material-symbols-outlined text-3xl">checkroom</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">1. Escolha</h3>
            <p className="text-sm text-gray-500">Navegue pelo catálogo e escolha as peças desejadas.</p>
          </div>

          <div className="flex flex-col items-center text-center p-8 bg-brand-navy/30 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl transition-all hover:border-white/10">
            <div className="size-16 rounded-full bg-white/5 text-brand-green flex items-center justify-center mb-6 border border-white/10">
              <span className="material-symbols-outlined text-3xl">chat</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">2. Informe</h3>
            <p className="text-sm text-gray-500">Mande uma mensagem informando as referências e tamanhos.</p>
          </div>

          <div className="flex flex-col items-center text-center p-8 bg-brand-navy/30 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl transition-all hover:border-white/10">
            <div className="size-16 rounded-full bg-white/5 text-white flex items-center justify-center mb-6 border border-white/10">
              <span className="material-symbols-outlined text-3xl">send</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">3. Confirme</h3>
            <p className="text-sm text-gray-500">Nossa equipe confirma o estoque e gera seu link de pagamento.</p>
          </div>
        </div>

        {/* Template Section */}
        <div className="bg-brand-navy/40 rounded-2xl border border-white/10 shadow-2xl overflow-hidden mt-10 backdrop-blur-lg">
          <div className="bg-brand-navy px-8 py-5 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-gold">description</span>
              Modelo de Pedido
            </h3>
            <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded">Dica: Copie este texto</span>
          </div>
          <div className="p-8 md:p-12">
            <div className="bg-black/30 p-6 rounded-xl border border-white/10 font-mono text-sm text-gray-400 mb-8 select-all cursor-copy whitespace-pre-wrap">
              {messageTemplate}
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageTemplate)}`}
                className="w-full py-4 bg-brand-green hover:bg-[#20bd5a] text-white font-black text-xl rounded-xl flex items-center justify-center gap-4 transition-all shadow-lg hover:shadow-brand-green/30"
              >
                <span className="material-symbols-outlined text-3xl">chat</span>
                INICIAR PEDIDO AGORA
              </a>
              <p className="text-center text-xs text-gray-400">Atendimento humanizado de Seg. a Sex. das 9h às 18h.</p>
            </div>
          </div>
        </div>

        {/* Price Preview (Dynamic if applied) */}
        {isApplied && (
          <div className="bg-brand-navy p-8 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="text-brand-gold font-bold uppercase tracking-widest text-xs mb-1">Simulação de Desconto</h4>
              <p className="text-gray-300 text-sm">Valor de exemplo para ilustrar o desconto de 20%</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-gray-400 line-through text-sm">R$ 100,00</span>
                <span className="text-3xl font-black text-brand-gold">R$ 80,00</span>
              </div>
              <div className="bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full text-xs font-bold">
                -20% OFF
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <Link to="/catalog" className="flex items-center gap-2 text-brand-gold font-bold hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            Voltar para o Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
