
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

    // Hooks moved here to avoid "Minified React error #310"
    const [coupon, setCoupon] = useState('');
    const [isApplied, setIsApplied] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [selectedSize, setSelectedSize] = useState<string>('');

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
            <span className="material-symbols-outlined text-6xl text-gray-700 mb-4">error</span>
            <h2 className="text-2xl font-black text-white mb-2">Produto não encontrado</h2>
            <p className="text-gray-500 mb-8">O produto que você procura não existe ou foi removido.</p>
            <Link to="/catalog" className="px-8 py-3 bg-brand-navy text-white font-black rounded-xl hover:bg-opacity-90 transition-all">
                VOLTAR PARA O CATÁLOGO
            </Link>
        </div>
    );


    const handleApplyCoupon = () => {
        if (coupon.toUpperCase() === 'URBAN20') {
            setIsApplied(true);
            setCouponError('');
        } else {
            setIsApplied(false);
            setCouponError('Cupom inválido.');
        }
    };

    const discountedPrice = isApplied ? product.price * 0.8 : product.price;

    const messageTemplate = `Olá, Urban Tide!
Tenho interesse no seguinte item:
🛒 *${product.name}*
🔢 REF: ${product.ref}
📏 TAMANHO: ${selectedSize || '(Não selecionado)'}

${isApplied ? `🎟️ *CUPOM APLICADO: URBAN20 (20% OFF)*\n🔐 Protocolo de Segurança: UT-2026-VERIFIED` : 'Gostaria de saber mais sobre este modelo.'}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageTemplate)}`;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <Link to="/catalog" className="hover:text-brand-gold transition-colors">Catálogo</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-white">{product.name}</span>
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
                                className={`size-20 md:size-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${mainImage === img ? 'border-brand-gold shadow-lg scale-95' : 'border-transparent hover:border-white/20'}`}
                            >
                                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image with Zoom */}
                    <div
                        className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-brand-navy/50 cursor-crosshair group shadow-2xl border border-white/5"
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

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-none uppercase italic tracking-tighter">{product.name}</h1>

                    <div className="flex flex-wrap items-center gap-4 mb-10">
                        <span className="text-[10px] font-black text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-lg tracking-widest uppercase">REF: {product.ref}</span>
                        <span className="text-[10px] font-black text-brand-navy bg-brand-gold border border-brand-gold/20 px-4 py-2 rounded-lg tracking-widest uppercase">{product.category}</span>
                    </div>

                    <div className="mb-12 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-8xl text-white">payments</span>
                        </div>

                        {product.oldPrice || isApplied ? (
                            <span className="text-xl text-gray-500 line-through block mb-2 font-medium opacity-50">
                                R$ {(product.oldPrice || product.price).toFixed(2).replace('.', ',')}
                            </span>
                        ) : null}

                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl md:text-7xl font-black text-white italic tracking-tighter">R$ {discountedPrice.toFixed(2).split('.')[0]}</span>
                            <span className="text-3xl font-black text-white italic tracking-tighter">,{discountedPrice.toFixed(2).split('.')[1]}</span>

                            {isApplied && (
                                <span className="ml-4 bg-brand-gold text-brand-navy text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter animate-bounce">
                                    -20% OFF
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Ou em até 3x sem juros no cartão</p>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Disponibilidade em Loja</h3>
                            <div className="h-px flex-grow bg-white/5"></div>
                        </div>
                        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${product.stock && product.stock > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            <span className="material-symbols-outlined text-xl">
                                {product.stock && product.stock > 0 ? 'check_circle' : 'error'}
                            </span>
                            {product.stock && product.stock > 0 ? `${product.stock} peças disponíveis` : 'Produto Indisponível'}
                        </div>
                    </div>

                    {/* Coupon Section */}
                    <div className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
                        <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mb-4">Cupom de Desconto</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="CUPOM"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                className="flex-grow px-4 py-2 rounded-xl border border-white/10 bg-black/40 text-white outline-none focus:ring-2 focus:ring-brand-gold font-bold uppercase placeholder:text-gray-600"
                            />
                            <button
                                onClick={handleApplyCoupon}
                                className="px-6 py-2 bg-brand-gold text-brand-navy font-black rounded-xl hover:bg-white hover:scale-105 transition-all shadow-lg"
                                style={{ backgroundColor: '#c5a059', color: '#0d131b' }}
                            >
                                APLICAR
                            </button>
                        </div>
                        {isApplied && (
                            <p className="text-[10px] font-black text-green-600 mt-2 uppercase tracking-widest flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Cupom aplicado com sucesso!
                            </p>
                        )}
                        {couponError && (
                            <p className="text-[10px] font-black text-red-600 mt-2 uppercase tracking-widest flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {couponError}
                            </p>
                        )}
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
                                const isSelected = selectedSize === s.size;
                                return (
                                    <button
                                        key={s.size}
                                        onClick={() => isAvailable && setSelectedSize(s.size)}
                                        className={`group relative ${!isAvailable ? 'opacity-30 pointer-events-none grayscale' : 'cursor-pointer'}`}
                                    >
                                        <div className={`size-14 md:size-16 rounded-2xl border-2 font-black flex items-center justify-center transition-all text-lg italic ${isSelected ? 'border-brand-gold bg-brand-gold/10 text-brand-gold shadow-lg shadow-brand-gold/20 scale-110' : 'border-white/10 text-white hover:border-brand-gold'}`}>
                                            {s.size}
                                        </div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-brand-navy text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 font-bold uppercase tracking-widest shadow-xl">
                                            {isAvailable ? `${s.width} x ${s.height}` : 'Indisponível'}
                                        </div>
                                    </button>
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
                        <button className="size-20 flex-shrink-0 rounded-2xl border-2 border-white/10 hover:border-brand-gold hover:bg-white/5 transition-all group flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-gray-600 group-hover:text-brand-gold transition-colors">share</span>
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5">
                        <div className="flex flex-col items-center sm:items-start gap-3">
                            <div className="size-12 rounded-2xl bg-brand-navy text-brand-gold flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-2xl">verified</span>
                            </div>
                            <div className="text-center sm:text-left">
                                <h4 className="font-black text-white text-sm uppercase tracking-tighter">100% Original</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Produto com garantia</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center sm:items-start gap-3">
                            <div className="size-12 rounded-2xl bg-brand-navy text-brand-gold flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-2xl">local_shipping</span>
                            </div>
                            <div className="text-center sm:text-left">
                                <h4 className="font-black text-white text-sm uppercase tracking-tighter">Envio Imediato</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Despachamos em 24h</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
