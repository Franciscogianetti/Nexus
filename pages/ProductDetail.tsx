
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import { WHATSAPP_NUMBER, SIZES } from '../constants';
import { useAuth } from '../context/AuthContext';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
        } else {
            setProduct(data);
            setMainImage(data.image);
        }
        setLoading(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        // Calculate percentage pos relative to page scroll too
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y, show: true });
    };

    const handleBuyClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            navigate('/login');
        }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center">
            <div className="animate-spin size-12 border-4 border-brand-gold border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Carregando detalhes...</p>
        </div>
    );

    if (!product) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">error</span>
            <h2 className="text-2xl font-black text-brand-navy mb-2">Produto não encontrado</h2>
            <p className="text-gray-500 mb-8">O produto que você procura não existe ou foi removido.</p>
            <Link to="/catalog" className="px-8 py-3 bg-brand-navy text-white font-black rounded-xl hover:bg-opacity-90 transition-all">
                VOLTAR PARA O CATÁLOGO
            </Link>
        </div>
    );

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name} (REF: ${product.ref})`)}`;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <Link to="/catalog" className="hover:text-brand-gold transition-colors">Catálogo</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-brand-navy">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Gallery Wrapper */}
                <div className="flex flex-col-reverse md:flex-row gap-4">
                    {/* Thumbnails */}
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] scrollbar-hide pb-4 md:pb-0">
                        {(product.images || [product.image]).map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImage(img)}
                                className={`size-20 md:size-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${mainImage === img ? 'border-brand-gold shadow-lg scale-95' : 'border-transparent hover:border-gray-200'}`}
                            >
                                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image with Zoom */}
                    <div
                        className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 cursor-crosshair group shadow-2xl"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setZoomPos(prev => ({ ...prev, show: false }))}
                    >
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500"
                        />

                        {/* Zoom Overlay (Lupa) */}
                        {zoomPos.show && (
                            <div
                                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:block"
                                style={{
                                    backgroundImage: `url("${mainImage}")`,
                                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                    backgroundSize: '250%'
                                }}
                            />
                        )}

                        {product.isNew && (
                            <span className="absolute top-6 left-6 bg-brand-navy text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-tighter z-20 shadow-xl">Novo Lançamento</span>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-brand-gold uppercase tracking-[0.3em]">{product.brand}</span>
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-brand-gold scale-[0.7] fill-1 text-[16px]">star</span>
                            ))}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-brand-navy mb-6 leading-none uppercase italic tracking-tighter">{product.name}</h1>

                    <div className="flex flex-wrap items-center gap-4 mb-10">
                        <span className="text-[10px] font-black text-gray-400 bg-white border border-gray-100 px-4 py-2 rounded-lg tracking-widest uppercase">REF: {product.ref}</span>
                        <span className="text-[10px] font-black text-brand-navy bg-brand-gold/10 border border-brand-gold/20 px-4 py-2 rounded-lg tracking-widest uppercase">{product.category}</span>
                    </div>

                    <div className="mb-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-8xl">payments</span>
                        </div>

                        {product.oldPrice && (
                            <span className="text-xl text-gray-400 line-through block mb-2 font-medium opacity-50">R$ {product.oldPrice.toFixed(2).replace('.', ',')}</span>
                        )}
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl md:text-7xl font-black text-brand-navy italic tracking-tighter">R$ {product.price.toFixed(2).split('.')[0]}</span>
                            <span className="text-3xl font-black text-brand-navy italic tracking-tighter">,{product.price.toFixed(2).split('.')[1]}</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Ou em até 3x sem juros no cartão</p>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Disponibilidade em Loja</h3>
                            <div className="h-px flex-grow bg-gray-100"></div>
                        </div>
                        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${product.stock && product.stock > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            <span className="material-symbols-outlined text-xl">
                                {product.stock && product.stock > 0 ? 'check_circle' : 'error'}
                            </span>
                            {product.stock && product.stock > 0 ? `${product.stock} peças disponíveis` : 'Produto Indisponível'}
                        </div>
                    </div>

                    {/* Sizes Section */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Grade de Tamanhos</h3>
                            <Link to="/size-guide" className="text-[10px] font-black text-brand-gold hover:text-brand-navy transition-colors uppercase tracking-widest border-b-2 border-brand-gold/30">Guia de Medidas</Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {SIZES.map(s => {
                                const isAvailable = (product.sizes || []).includes(s.size) || (!product.sizes || product.sizes.length === 0);
                                return (
                                    <div key={s.size} className={`group relative ${!isAvailable ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                                        <div className="size-14 md:size-16 rounded-2xl border-2 border-gray-100 font-black text-brand-navy flex items-center justify-center hover:border-brand-gold hover:bg-brand-gold/5 transition-all cursor-default text-lg italic">
                                            {s.size}
                                        </div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-brand-navy text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 font-bold uppercase tracking-widest shadow-xl">
                                            {isAvailable ? `${s.width} x ${s.height}` : 'Indisponível'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleBuyClick}
                            className="flex-grow h-20 bg-brand-navy text-white font-black text-xl rounded-2xl flex items-center justify-center gap-4 hover:bg-brand-gold hover:text-brand-navy transition-all shadow-2xl hover:-translate-y-2 group cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-3xl text-brand-gold group-hover:text-brand-navy transition-colors">chat</span>
                            COMPRAR PELO WHATSAPP
                        </a>
                        <button className="size-20 flex-shrink-0 rounded-2xl border-2 border-gray-100 hover:border-brand-gold hover:bg-gray-50 transition-all group flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-brand-gold transition-colors">share</span>
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                        <div className="flex flex-col items-center sm:items-start gap-3">
                            <div className="size-12 rounded-2xl bg-brand-navy text-brand-gold flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-2xl">verified</span>
                            </div>
                            <div className="text-center sm:text-left">
                                <h4 className="font-black text-brand-navy text-sm uppercase tracking-tighter">100% Original</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Produto com garantia</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center sm:items-start gap-3">
                            <div className="size-12 rounded-2xl bg-brand-navy text-brand-gold flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-2xl">local_shipping</span>
                            </div>
                            <div className="text-center sm:text-left">
                                <h4 className="font-black text-brand-navy text-sm uppercase tracking-tighter">Envio Imediato</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Despachamos em 24h</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
