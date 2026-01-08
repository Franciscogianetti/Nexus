import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Category, Product } from '../types';
import { supabase } from '../lib/supabase';
import { WHATSAPP_NUMBER } from '../constants';
import ProductCard from '../components/ProductCard';

const Catalog: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [location.search]);

  const categories = ['Todos', ...Object.values(Category)];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-12 flex flex-col lg:flex-row gap-10">
      {/* Sidebar Filters */}
      <aside className="lg:w-64 shrink-0 flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">filter_list</span>
            Filtrar por
          </h3>
          <div className="flex flex-col gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`text-left px-4 py-2 rounded-lg text-sm transition-all ${selectedCategory === cat
                  ? 'bg-brand-gold text-brand-navy font-bold shadow-md'
                  : 'text-gray-500 hover:bg-gray-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h4 className="font-bold text-brand-navy mb-2">Suporte Direto</h4>
          <p className="text-xs text-gray-400 mb-4">Dúvidas sobre o produto or estoque? Fale conosco.</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-brand-navy text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-brand-navy tracking-tight">{selectedCategory}</h1>
            <p className="text-sm text-gray-400">Exibindo {filteredProducts.length} produtos encontrados</p>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
            <input
              type="text"
              placeholder="Buscar no catálogo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-brand-gold focus:border-brand-gold"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">search_off</span>
            <h3 className="text-xl font-bold text-gray-400">Nenhum produto encontrado</h3>
            <p className="text-gray-400">Tente ajustar seus filtros ou busca.</p>
            <button
              onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
