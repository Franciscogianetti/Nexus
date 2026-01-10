import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-navy border-b-2 border-brand-gold shadow-lg">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 h-40 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-white">
          <img src="/public/urban_tide_logo.png" alt="Urban Tide Logo" className="h-36 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'}`}>Início</Link>
          <Link to="/catalog" className={`text-sm font-medium transition-colors ${isActive('/catalog') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'}`}>Catálogo</Link>
          <Link to="/size-guide" className={`text-sm font-medium transition-colors ${isActive('/size-guide') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'}`}>Tabela de Medidas</Link>
          <Link to="/checkout" className={`text-sm font-medium transition-colors ${isActive('/checkout') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'}`}>Como Pedir</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-white/10 rounded-full px-3 py-1.5 border border-white/20">
            <span className="material-symbols-outlined text-gray-300 text-lg">search</span>
            <input
              className="bg-transparent border-none text-white placeholder-gray-400 text-sm focus:ring-0 w-32 lg:w-48"
              placeholder="Buscar..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={user.email === 'casa18038@gmail.com' ? "/admin" : "/login"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <span className="material-symbols-outlined text-xl">person</span>
                <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">
                  {user.email === 'casa18038@gmail.com' ? 'Admin' : 'Perfil'}
                </span>
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white"
                title="Sair"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-white">
              <span className="material-symbols-outlined text-xl">person</span>
              <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">Conta</span>
            </Link>
          )}

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-navy border-t border-white/10 px-4 py-6 flex flex-col gap-4">
          <Link to="/" className="text-white font-medium py-2 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Início</Link>
          <Link to="/catalog" className="text-white font-medium py-2 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
          <Link to="/size-guide" className="text-white font-medium py-2 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Tabela de Medidas</Link>
          <Link to="/checkout" className="text-white font-medium py-2 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Como Pedir</Link>
          {user?.email === 'casa18038@gmail.com' && (
            <Link to="/admin" className="text-brand-gold font-bold py-2 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Painel Admin</Link>
          )}
          {user ? (
            <button
              onClick={() => { supabase.auth.signOut(); setIsMenuOpen(false); }}
              className="text-white font-medium py-2 text-left"
            >
              Sair
            </button>
          ) : (
            <Link to="/login" className="text-white font-medium py-2" onClick={() => setIsMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
