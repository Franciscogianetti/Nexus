
import React from 'react';
import { SIZES, WHATSAPP_NUMBER } from '../constants';

const SizeGuide: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-10 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-[20px] text-brand-gold">straighten</span>
          Guia de Medidas
        </div>
        <h1 className="text-4xl font-black tracking-tight md:text-5xl text-white">Encontre o seu tamanho ideal</h1>
        <p className="max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          Use nossa tabela de referência para garantir o caimento perfeito. Recomendamos comparar as medidas com uma camisa que você já possui e gosta do caimento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Table Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">Dimensões do Produto</h3>
            <span className="text-xs font-medium bg-white/5 px-3 py-1 rounded text-gray-500">Medidas em cm</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/5 shadow-2xl bg-brand-navy/30 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-white/5 text-gray-400 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-5">Tamanho</th>
                    <th className="px-6 py-5 text-center">Largura (Torax)</th>
                    <th className="px-6 py-5 text-center">Altura (Comprimento)</th>
                    <th className="px-6 py-5 text-center">Peso Sugerido</th>
                    <th className="px-6 py-5 text-center">Altura Sugerida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {SIZES.map(s => (
                    <tr key={s.size} className="hover:bg-white/5 transition-colors group cursor-default">
                      <td className="px-6 py-4 font-bold text-lg text-white group-hover:text-brand-gold">{s.size}</td>
                      <td className="px-6 py-4 text-center font-medium text-gray-300">{s.width}</td>
                      <td className="px-6 py-4 text-center font-medium text-gray-300">{s.height}</td>
                      <td className="px-6 py-4 text-center text-gray-500">{s.weight}</td>
                      <td className="px-6 py-4 text-center text-gray-500">{s.suggestedHeight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-white/5 border-t border-white/5 text-xs text-gray-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Margem de tolerância: +/- 1 a 2 cm devido ao processo de fabricação manual.
            </div>
          </div>
        </div>

        {/* Instructions Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">Como Medir Corretamente</h3>
          <div className="rounded-2xl border border-white/5 bg-brand-navy/30 backdrop-blur-md p-8 shadow-2xl flex flex-col gap-8">
            <div className="relative w-full aspect-[4/3] bg-white/5 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
              <div className="relative w-40 h-48 border-2 border-gray-700 rounded-t-3xl border-b-0 mx-auto mt-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 border-2 border-gray-700 rounded-full bg-brand-navy z-10"></div>
                <div className="absolute top-0 -left-8 w-8 h-24 border-2 border-gray-700 -skew-x-12 origin-top-right border-r-0 rounded-l-lg"></div>
                <div className="absolute top-0 -right-8 w-8 h-24 border-2 border-gray-700 skew-x-12 origin-top-left border-l-0 rounded-r-lg"></div>
                <div className="absolute top-0 left-0 w-full h-full border-b-2 border-gray-700 bg-brand-navy z-0"></div>

                {/* Lines */}
                <div className="absolute top-20 left-0 w-full flex items-center justify-center gap-1">
                  <div className="h-[1px] flex-1 bg-brand-gold"></div>
                  <span className="text-[8px] font-bold text-brand-gold bg-brand-navy px-1">LARGURA</span>
                  <div className="h-[1px] flex-1 bg-brand-gold"></div>
                </div>
                <div className="absolute top-0 left-1/2 h-full flex flex-col items-center justify-center gap-1 -ml-[0.5px]">
                  <div className="w-[1px] flex-1 bg-brand-gold"></div>
                  <span className="text-[8px] font-bold text-brand-gold bg-brand-navy py-1 rotate-90">ALTURA</span>
                  <div className="w-[1px] flex-1 bg-brand-gold"></div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { n: 1, t: 'Base plana', d: 'Estenda uma camisa que você já usa sobre uma mesa ou cama, bem esticada.' },
                { n: 2, t: 'Largura', d: 'Meça a frente, logo abaixo das axilas, de uma costura à outra.' },
                { n: 3, t: 'Altura', d: 'Do ponto mais alto do ombro (perto da gola) até a barra inferior.' }
              ].map(step => (
                <div key={step.n} className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold font-bold text-sm shadow-inner shadow-brand-gold/5">{step.n}</div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{step.t}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fit Gallery */}
      <section className="mt-10">
        <h3 className="text-2xl font-bold text-white mb-8 uppercase tracking-widest italic">Referência de Caimento</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group relative overflow-hidden rounded-2xl bg-slate-100 aspect-[3/4] shadow-md">
            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6QtvYWrY7aoMWImwUW35x6TFGJ2hLYCXMHlhVQ62OoViPOauZ1-PfVoBjKR5aDEv6_Aw2E0HHA068DzuQMCOLgtqnge3GC3rMM27kYRjORGRAwxGMRd3Jute_heEi7ae52I3OQytHi81gEueiy9kB6bn7cDN8hMHtuQsYrtmSfxGWKG011bk4IAiqq8hXk4Mad2QLNWbzQGSbMZwRYrxaSSEETa-rCTPCU0iVTjO6pahvAfnvFzMx0VHy8UgGWWSyykkFB1mbO50')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="font-bold text-xl mb-1">Tamanho M</p>
              <p className="text-sm opacity-80">Modelo: 1.75m / 76kg</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-slate-100 aspect-[3/4] shadow-md">
            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAjPTs_K2NxfqvpiTFIiC9NviTXwwdfNCFhoaxRffnUOkGcJvBCdnyjDW03t-QliHghbejtaIBr-fm2IqguULvUlPXpZh6wKbxrzE6yvNwfwFii7iO5C4gBYWhLS9FVqm0pxEJDEeng1ux5sjjQpHYdan4Vo_5IDEZLZU_c2rwr9P8-XN_YOeyWILudTDQANVCbkNXlxRtMi6Gvi0BSA_yUkP2_TtTQyKrRgwLXDTjKaCM_yA5QeCmpjN3vikKKTpM4j7vwyvHcL1E')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="font-bold text-xl mb-1">Tamanho G</p>
              <p className="text-sm opacity-80">Modelo: 1.82m / 84kg</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-slate-100 aspect-[3/4] shadow-md">
            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAn929ezT5e-969CZTKzyDsi-11VslkL7_mc_zGUSwQWFrOEH07a6oGpc3bHuOyEbAzToFjgGupGvEOpNhFr4mkSbkPLfXhvKUvf42mkoXkTBQgq2exocxBFqLFHjj4PIEU0XybVPmMK8-w4ayePNYXA7M8jQs1d6XSwtvRtODy7IaveD6V5H_U060Rk7nIYb0tRX5OsFbtqlIzshY53hMqpFYKy02YYWTyzDdUVhEM2ZbDLXwKN7QKeogCSD-XhORyaj3eEfl_6sI')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="font-bold text-xl mb-1">Tamanho GG</p>
              <p className="text-sm opacity-80">Modelo: 1.90m / 92kg</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Help */}
      <div className="rounded-3xl bg-brand-navy p-10 md:p-16 relative overflow-hidden text-center md:text-left">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Ainda inseguro com o tamanho?</h2>
            <p className="text-gray-300 text-lg">
              Nosso atendimento via WhatsApp pode te ajudar. Mande sua altura e peso e recomendaremos o tamanho ideal com base no seu biotipo.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 h-16 px-10 bg-brand-gold hover:bg-[#b08d4b] text-brand-navy font-bold rounded-xl shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
          >
            <span className="material-symbols-outlined">chat</span>
            Falar com Especialista
          </a>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
