'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Sparkles, Building2, HelpCircle, Globe2 } from 'lucide-react';

export default function NewCampaignPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [questions, setQuestions] = useState([
    'Qual foi o maior benefício ou resultado alcançado?',
    'Recomendaria os nossos serviços a outras empresas? Porquê?',
    'O que mais se destacou no nosso atendimento e suporte?'
  ]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setBusinessName(name);
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('campaigns')
      .insert([
        {
          business_name: businessName,
          slug,
          questions: questions.filter((q) => q.trim().length > 0),
          user_id: user?.id || null
        }
      ]);

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 selection:bg-orange-500">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          href="/dashboard"
          prefetch={false}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </Link>

        <div>
          <h1 className="text-3xl font-black tracking-tight">Criar Nova Campanha</h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure a página exclusiva onde os seus clientes irão submeter os testemunhos.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Nome da Empresa ou Marca
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={businessName}
                onChange={handleNameChange}
                placeholder="Ex: Clínica Sorriso Perfeito"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Ligação de Acesso (Slug)
            </label>
            <div className="relative">
              <Globe2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="clinica-sorriso-perfeito"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-orange-400 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              URL que será enviada ao cliente: <span className="text-slate-400">/c/{slug || 'nome-da-campanha'}</span>
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Perguntas Orientadoras para o Cliente
            </label>
            {questions.map((q, idx) => (
              <div key={idx} className="relative">
                <HelpCircle className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => handleQuestionChange(idx, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'A criar campanha...' : 'Publicar Campanha e Gerar Ligações'}
          </button>
        </form>
      </div>
    </div>
  );
}