
import React from 'react';

const Policies: React.FC = () => {
    return (
        <div className="max-w-[800px] mx-auto px-4 py-20 flex flex-col gap-12">
            <section>
                <h1 className="text-4xl font-black text-white mb-6 tracking-tight uppercase italic">Políticas da Urban Tide</h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Transparência e respeito ao cliente são nossos pilares. Abaixo você encontra informações detalhadas sobre trocas e entregas.
                </p>
            </section>

            <section className="bg-brand-navy/30 p-8 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-3 text-brand-gold mb-4">
                    <span className="material-symbols-outlined">sync</span>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Política de Trocas</h2>
                </div>
                <div className="space-y-4 text-gray-400 leading-relaxed">
                    <p>
                        Oferecemos a <strong className="text-white">primeira troca grátis</strong> em até 7 dias após o recebimento do produto, caso o tamanho não tenha ficado ideal ou você deseje outro modelo.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-500">
                        <li>O produto deve estar com as etiquetas originais fixadas.</li>
                        <li>Não pode apresentar sinais de uso ou lavagem.</li>
                        <li>A solicitação deve ser feita via <span className="text-brand-green font-bold text-sm">WhatsApp</span> com o número do seu pedido.</li>
                    </ul>
                </div>
            </section>

            <section className="bg-brand-navy/30 p-8 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-3 text-brand-gold mb-4">
                    <span className="material-symbols-outlined">local_shipping</span>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Prazos de Entrega</h2>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        Nossas entregas são feitas via Correios ou Transportadoras parceiras, garantindo agilidade e segurança.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                            <h4 className="font-bold text-white mb-1 uppercase text-xs tracking-widest">Sudeste</h4>
                            <p className="text-sm text-gray-400 font-bold italic">2 a 5 dias úteis</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                            <h4 className="font-bold text-white mb-1 uppercase text-xs tracking-widest">Sul e Centro-Oeste</h4>
                            <p className="text-sm text-gray-400 font-bold italic">4 a 8 dias úteis</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                            <h4 className="font-bold text-white mb-1 uppercase text-xs tracking-widest">Norte e Nordeste</h4>
                            <p className="text-sm text-gray-400 font-bold italic">7 a 15 dias úteis</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="bg-brand-navy text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-1">Ainda tem dúvidas?</h3>
                    <p className="text-gray-400 text-sm">Estamos prontos para te ajudar agora mesmo.</p>
                </div>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="bg-brand-gold text-brand-navy px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
                    <span className="material-symbols-outlined">chat</span>
                    Suporte WhatsApp
                </a>
            </div>
        </div>
    );
};

export default Policies;
