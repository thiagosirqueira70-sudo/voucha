'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { error: insertError } = await supabase
        .from('campaigns')
        .insert([
          {
            name,
            slug,
            title: title || `Deixe o seu feedback sobre ${name}`,
            message: message || 'A sua opinião é fundamental para evoluirmos continuamente os nossos serviços.',
            user_id: user.id
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar a campanha. Tente outro link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg bg-[#0d1527] border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-bold text-white">Criar Nova Campanha</h1>
            <p className="text-xs text-slate-400 mt-0.5">Configure a sua página personalizada de recolha.</p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition"
          >
            Voltar
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Nome do Produto ou Empresa
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="ex: Sirqueira Studio"
              className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Link da Página (Slug)
            </label>
            <div className="flex items-center bg-[#070b14] border border-slate-700/80 rounded-xl px-3 py-2 text-sm">
              <span className="text-slate-500 text-xs select-none">/c/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="nome-da-campanha"
                className="w-full bg-transparent border-none focus:outline-none text-amber-400 text-sm pl-1"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Este será o endereço público partilhado com os clientes.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Título do Cabeçalho (Opcional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Conte-nos como foi a sua experiência!"
              className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Mensagem de Apresentação (Opcional)
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ex: Deixe um breve depoimento sobre os resultados que alcançámos juntos."
              className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-semibold text-slate-950 rounded-xl text-sm transition shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            {loading ? 'A criar campanha...' : 'Publicar Campanha'}
          </button>
        </form>
      </div>
    </div>
  );
}