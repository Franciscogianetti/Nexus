
import React from 'react';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre o produto: ${product.name} (REF: ${product.ref})`)}`;

  const handleBuy = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
        <div
          className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url("${product.image}")` }}
        ></div>
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-brand-navy text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-lg">Novo</div>
        )}
        {product.oldPrice && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-lg">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
          </div>
        )}
      </Link>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">{product.brand}</span>
          <span className="text-[10px] text-gray-300">REF: {product.ref}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block group/title">
          <h3 className="text-brand-navy font-bold text-lg mb-1 truncate group-hover/title:text-brand-gold transition-colors">{product.name}</h3>
        </Link>

        {product.colors && (
          <div className="flex gap-1.5 mb-3">
            {product.colors.map((c, i) => (
              <div key={i} className="size-3 rounded-full border border-gray-200" style={{ backgroundColor: c }}></div>
            ))}
          </div>
        )}

        <div className="mb-4 flex justify-between items-end">
          <div>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through block">R$ {product.oldPrice.toFixed(2).replace('.', ',')}</span>
            )}
            <span className="text-brand-gold font-bold text-xl">R$ {product.price.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="text-right">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${product.stock && product.stock > 0 ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600'}`}>
              {product.stock && product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
            </span>
          </div>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="w-full h-10 rounded bg-brand-navy text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
        >
          VER DETALHES
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
