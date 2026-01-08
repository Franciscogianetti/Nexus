
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [msg, setMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setMsg({ type: 'error', text: 'Erro ao cadastrar: ' + error.message });
            } else {
                setMsg({ type: 'success', text: 'Cadastro realizado! Verifique seu e-mail para confirmar a conta.' });
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setMsg({ type: 'error', text: 'Erro ao fazer login: ' + error.message });
            } else {
                setMsg({ type: 'success', text: 'Login realizado com sucesso!' });
                setTimeout(() => navigate('/'), 1500);
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-brand-navy mb-2">
                        {isSignUp ? 'Criar Conta' : 'Acesso Restrito'}
                    </h1>
                    <p className="text-gray-500">
                        {isSignUp ? 'Cadastre-se para aproveitar a Urban Tide' : 'Faça login para gerenciar a Urban Tide'}
                    </p>
                </div>

                {msg && (
                    <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-brand-navy mb-2">E-mail</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-navy mb-2">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all pr-12"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy transition-colors focus:outline-none"
                            >
                                <span className="material-symbols-outlined">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-brand-navy text-white font-black rounded-xl hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? 'Carregando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
                    <button
                        onClick={() => { setIsSignUp(!isSignUp); setMsg(null); }}
                        className="text-sm font-bold text-brand-navy hover:text-brand-gold transition-colors text-center"
                    >
                        {isSignUp ? 'Já tem conta? Faça login' : 'Ainda não tem conta? Cadastre-se'}
                    </button>
                    <a href="/" className="text-center text-sm text-gray-500 hover:text-brand-navy">
                        ← Voltar para a Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
