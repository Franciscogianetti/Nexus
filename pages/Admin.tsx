
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Category, Product, Gender } from '../types';
import { PRODUCTS } from '../constants';

const Admin: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [msg, setMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form state for new/editing product
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [showForm, setShowForm] = useState(false);

    const isAdmin = user?.email === 'casa18038@gmail.com';

    useEffect(() => {
        if (isAdmin) {
            fetchProducts();
        }
    }, [isAdmin]);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleSync = async () => {
        setSyncing(true);
        setMsg(null);

        // Check if table exists (simple check by trying to select)
        const { error: checkError } = await supabase.from('products').select('id').limit(1);

        if (checkError && checkError.code === '42P01') {
            setMsg({ type: 'error', text: 'A tabela "products" não existe no Supabase. Por favor, crie-a no painel do Supabase primeiro.' });
            setSyncing(false);
            return;
        }

        const productsToSync = PRODUCTS.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            price: p.price,
            oldPrice: p.oldPrice,
            category: p.category,
            gender: p.gender || Gender.MALE,
            image: p.image,
            images: p.images || [p.image],
            stock: p.stock || 10,
            isNew: p.isNew,
            ref: p.ref,
            colors: p.colors,
            sizes: ['P', 'M', 'G', 'GG'] // Default to all sizes for initial sync
        }));

        const { error } = await supabase.from('products').upsert(productsToSync);

        if (error) {
            setMsg({ type: 'error', text: 'Erro ao sincronizar: ' + error.message });
        } else {
            setMsg({ type: 'success', text: 'Produtos sincronizados com sucesso!' });
            fetchProducts();
        }
        setSyncing(false);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            ...editingProduct,
            id: editingProduct?.id || crypto.randomUUID(),
        };

        const { error } = await supabase.from('products').upsert(productData);

        if (error) {
            setMsg({ type: 'error', text: 'Erro ao salvar: ' + error.message });
        } else {
            setMsg({ type: 'success', text: 'Produto salvo com sucesso!' });
            setShowForm(false);
            setEditingProduct(null);
            fetchProducts();
        }
        setLoading(false);
    };

    const handleDeleteProduct = async (id: string) => {
        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            setMsg({ type: 'error', text: 'Erro ao excluir: ' + error.message });
        } else {
            setMsg({ type: 'success', text: 'Produto excluído!' });
            fetchProducts();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files);
        setUploading(true);
        setMsg(null);

        try {
            const uploadedUrls: string[] = [];

            for (const fileObj of files) {
                const file = fileObj as File;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            }

            setEditingProduct(prev => {
                const currentImages = prev?.images || [];
                const firstImage = prev?.image || uploadedUrls[0];
                return {
                    ...prev,
                    image: firstImage,
                    images: [...currentImages, ...uploadedUrls]
                };
            });

            setMsg({ type: 'success', text: `${files.length} imagem(ns) carregada(s) com sucesso!` });
        } catch (error: any) {
            setMsg({ type: 'error', text: 'Erro ao carregar imagem: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    if (authLoading) return <div className="p-10 text-center">Carregando...</div>;
    if (!isAdmin) return <Navigate to="/login" />;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Painel Admin</h1>
                    <p className="text-gray-500 text-sm">Gerencie o estoque e preços da Urban Tide</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={async () => {
                            setSyncing(true);
                            try {
                                // Attempt to create bucket
                                const { error: bucketError } = await supabase.storage.createBucket('products', { public: true });
                                if (bucketError && bucketError.message !== 'Bucket already exists') {
                                    throw bucketError;
                                }
                                setMsg({ type: 'success', text: 'Supabase configurado com sucesso! (Bucket "products" pronto)' });
                            } catch (err: any) {
                                setMsg({ type: 'error', text: 'Erro na configuração: ' + err.message + '. Certifique-se de que as tabelas SQL foram criadas (veja walkthrough).' });
                            } finally {
                                setSyncing(false);
                            }
                        }}
                        disabled={syncing}
                        className="px-6 py-2 bg-brand-gold text-brand-navy font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        Configurar Sistema
                    </button>
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="px-6 py-2 border-2 border-brand-navy bg-brand-navy text-white font-bold rounded-lg hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">sync</span>
                        {syncing ? 'Sincronizando...' : 'Sincronizar Código'}
                    </button>
                    <button
                        onClick={() => { setEditingProduct({}); setShowForm(true); }}
                        className="px-6 py-2 bg-brand-gold text-brand-navy font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-brand-gold/10"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Novo Produto
                    </button>
                    <button
                        onClick={async () => {
                            if (window.confirm('ATENÇÃO: Tem certeza que deseja excluir TODOS os produtos? Esta ação não pode ser desfeita.')) {
                                setLoading(true);
                                const { data: allData } = await supabase.from('products').select('id');
                                if (allData && allData.length > 0) {
                                    const ids = allData.map(p => p.id);
                                    const { error } = await supabase.from('products').delete().in('id', ids);
                                    if (error) {
                                        setMsg({ type: 'error', text: 'Erro ao excluir tudo: ' + error.message });
                                    } else {
                                        setMsg({ type: 'success', text: 'Todos os produtos foram excluídos com sucesso.' });
                                        fetchProducts();
                                    }
                                } else {
                                    setMsg({ type: 'success', text: 'Não há produtos para excluir.' });
                                }
                                setLoading(false);
                            }
                        }}
                        className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">delete_forever</span>
                        Excluir Tudo
                    </button>
                </div>
            </div>

            {msg && (
                <div className={`mb-8 p-4 rounded-lg text-sm font-medium flex justify-between items-center ${msg.type === 'error' ? 'bg-red-900/20 text-red-500 border border-red-500/20' : 'bg-green-900/20 text-green-500 border border-green-500/20'
                    }`}>
                    {msg.text}
                    <button onClick={() => setMsg(null)} className="material-symbols-outlined text-sm">close</button>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-brand-navy w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/10">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 text-white">
                            <h2 className="text-xl font-bold uppercase italic tracking-widest">{editingProduct?.id ? 'Editar Produto' : 'Novo Produto'}</h2>
                            <button onClick={() => setShowForm(false)} className="material-symbols-outlined hover:text-brand-gold transition-colors">close</button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Nome</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-brand-gold text-white"
                                        value={editingProduct?.name || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Referência (REF)</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-brand-gold text-white"
                                        value={editingProduct?.ref || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, ref: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Preço Atual</label>
                                    <input
                                        type="number" step="0.01" required
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-brand-gold text-white"
                                        value={editingProduct?.price || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Preço Antigo (Promoção)</label>
                                    <input
                                        type="number" step="0.01"
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-brand-gold text-white"
                                        value={editingProduct?.oldPrice || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, oldPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                                        placeholder="Opcional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Categoria</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-brand-gold text-white"
                                        value={editingProduct?.category || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as Category })}
                                    >
                                        <option value="" className="bg-brand-navy">Selecione...</option>
                                        {Object.values(Category).map(cat => <option key={cat} value={cat} className="bg-brand-navy">{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Marca</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-brand-gold text-white"
                                        value={editingProduct?.brand || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Gênero</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-brand-gold text-white"
                                        value={editingProduct?.gender || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, gender: e.target.value as Gender })}
                                    >
                                        <option value="" className="bg-brand-navy">Selecione...</option>
                                        {Object.values(Gender).map(g => <option key={g} value={g} className="bg-brand-navy">{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Quantidade em Estoque</label>
                                    <input
                                        type="number" required min="0"
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-brand-gold text-white"
                                        value={editingProduct?.stock || 0}
                                        onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tamanhos Disponíveis</label>
                                <div className="flex gap-4">
                                    {['P', 'M', 'G', 'GG'].map(size => (
                                        <label key={size} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="accent-brand-gold size-4"
                                                checked={(editingProduct?.sizes || []).includes(size)}
                                                onChange={e => {
                                                    const currentSizes = editingProduct?.sizes || [];
                                                    const newSizes = e.target.checked
                                                        ? [...currentSizes, size]
                                                        : currentSizes.filter(s => s !== size);
                                                    setEditingProduct({ ...editingProduct, sizes: newSizes });
                                                }}
                                            />
                                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Imagens do Produto (Múltiplas)</label>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap gap-4">
                                        {(editingProduct?.images || (editingProduct?.image ? [editingProduct.image] : [])).map((img, idx) => (
                                            <div key={idx} className="relative group w-32 h-32">
                                                <img
                                                    src={img}
                                                    alt={`Preview ${idx}`}
                                                    className="w-full h-full object-cover rounded-xl border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = (editingProduct?.images || []).filter((_, i) => i !== idx);
                                                        setEditingProduct(prev => ({
                                                            ...prev,
                                                            images: newImages,
                                                            image: (prev?.image === img) ? (newImages[0] || '') : prev?.image
                                                        }));
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                                {img === editingProduct?.image && (
                                                    <span className="absolute bottom-1 left-1 bg-brand-gold text-brand-navy text-[8px] font-bold px-1.5 py-0.5 rounded">PRINCIPAL</span>
                                                )}
                                                {img !== editingProduct?.image && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingProduct(prev => ({ ...prev, image: img }))}
                                                        className="absolute bottom-1 right-1 bg-white/80 hover:bg-white text-xs px-1.5 py-0.5 rounded shadow text-brand-navy font-bold"
                                                    >
                                                        Definir Principal
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".png, .jpg, .jpeg"
                                            multiple
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className={`flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-brand-gold hover:bg-white/5 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploading ? (
                                                <>
                                                    <div className="animate-spin size-5 border-2 border-brand-gold border-t-transparent rounded-full"></div>
                                                    <span className="text-sm font-bold text-gray-500">Enviando imagens...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-gray-600">cloud_upload</span>
                                                    <span className="text-sm font-bold text-gray-500">
                                                        Adicionar Fotos do Computador
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox" id="isNew"
                                    checked={editingProduct?.isNew || false}
                                    onChange={e => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                                    className="accent-brand-gold size-4"
                                />
                                <label htmlFor="isNew" className="text-sm font-bold text-white uppercase tracking-widest text-xs">Marcar como "Novo"</label>
                            </div>
                            <div className="pt-6 flex gap-4">
                                <button type="submit" className="flex-1 py-3 bg-brand-gold text-brand-navy font-black rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-gold/20 uppercase tracking-widest">
                                    SALVAR PRODUTO
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-white/10 text-gray-500 font-bold rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest text-xs">
                                    CANCELAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-brand-navy/30 rounded-2xl shadow-2xl border border-white/5 overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produto</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preço</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estoque</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Gênero</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-12 rounded bg-black/20 bg-cover bg-center border border-white/10" style={{ backgroundImage: `url("${p.image}")` }}></div>
                                            <div>
                                                <div className="font-bold text-white">{p.name}</div>
                                                <div className="text-xs text-gray-500">{p.brand} • REF: {p.ref}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-white/5 text-gray-400 text-[10px] font-bold rounded uppercase border border-white/5">{p.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">R$ {p.price.toFixed(2).replace('.', ',')}</div>
                                        {p.oldPrice && <div className="text-xs text-gray-600 line-through">R$ {p.oldPrice.toFixed(2).replace('.', ',')}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`font-bold ${p.stock && p.stock > 0 ? 'text-gray-400' : 'text-red-500'}`}>
                                            {p.stock || 0} unid.
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.isNew && <span className="px-2 py-0.5 bg-blue-900/20 text-blue-400 text-[10px] font-bold rounded uppercase border border-blue-500/20">Novo</span>}
                                        {p.oldPrice && <span className="ml-2 px-2 py-0.5 bg-red-900/20 text-red-500 text-[10px] font-bold rounded uppercase border border-red-500/20">Promo</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-white/5 text-gray-500 text-[10px] font-bold rounded uppercase border border-white/5">{p.gender}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {deletingId === p.id ? (
                                                <div className="flex items-center gap-2 bg-red-900/20 px-2 py-1 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-right-2">
                                                    <span className="text-[10px] font-bold text-red-500 uppercase">Excluir?</span>
                                                    <button
                                                        onClick={() => { handleDeleteProduct(p.id); setDeletingId(null); }}
                                                        className="px-2 py-1 bg-red-500 text-white text-[10px] font-black rounded hover:bg-red-600 transition-colors"
                                                    >
                                                        SIM
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingId(null)}
                                                        className="px-2 py-1 bg-white/10 text-gray-400 text-[10px] font-bold rounded hover:bg-white/20 transition-colors"
                                                    >
                                                        NÃO
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => { setEditingProduct(p); setShowForm(true); }}
                                                        className="p-2 text-gray-600 hover:text-brand-gold transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingId(p.id)}
                                                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined">delete_outline</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && !loading && (
                    <div className="p-20 text-center flex flex-col items-center">
                        <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">inventory_2</span>
                        <p className="text-gray-400 font-medium">Nenhum produto cadastrado no banco de dados.</p>
                        <button onClick={handleSync} className="mt-4 text-brand-gold font-bold hover:underline">Sincronizar produtos iniciais</button>
                    </div>
                )}
                {loading && (
                    <div className="p-20 text-center">
                        <div className="animate-spin size-8 border-4 border-brand-gold border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-gray-400">Carregando estoque...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
