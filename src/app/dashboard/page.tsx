'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Campaign {
  id: string;
  name?: string;
  business_name?: string;
  slug: string;
}

interface Testimonial {
  id: string;
  campaign_id: string;
  type: 'video' | 'audio' | 'text';
  author_name: string;
  author_title: string | null;
  content: string | null;
  media_url: string | null;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { data: campaignsData } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (campaignsData && campaignsData.length > 0) {
      setCampaigns(campaignsData);
      const activeId = selectedCampaignId && campaignsData.some(c => c.id === selectedCampaignId)
        ? selectedCampaignId
        : campaignsData[0].id;

      setSelectedCampaignId(activeId);
      await loadTestimonials(activeId);
    } else {
      setCampaigns([]);
      setTestimonials([]);
    }

    setLoading(false);
  };

  const loadTestimonials = async (campaignId: string) => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    setTestimonials(data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCampaignChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCampaignId(id);
    await loadTestimonials(id);
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('testimonials').update({ status }).eq('id', id);
    setTestimonials(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const collectionUrl = selectedCampaign ? `${origin}/c/${selectedCampaign.slug}` : '';
  const widgetCode = `<script src="${origin}/widget.js" data-wall="${selectedCampaign?.slug}"></script>`;

  const copyToClipboard = (text: string, type: 'link' | 'widget') => {
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const exportCSV = () => {
    if (!testimonials.length) return;
    const headers = ['Autor', 'Cargo/Empresa', 'Tipo', 'Avaliacao', 'Depoimento', 'Status', 'Data'];
    const rows = testimonials.map(t => [
      `"${t.author_name || ''}"`,
      `"${t.author_title || ''}"`,
      `"${t.type}"`,
      t.rating,
      `"${(t.content || '').replace(/"/g, '""')}"`,
      `"${t.status}"`,
      `"${t.created_at}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `depoimentos-${selectedCampaign?.slug || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-6 md:p-10">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20">
            V
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">Voucha</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Business
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Área de Moderação de Testemunhos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={!testimonials.length}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition disabled:opacity-40"
          >
            Exportar CSV
          </button>
          <Link
            href="/dashboard/new"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 transition shadow-lg shadow-amber-500/10"
          >
            + Nova Campanha
          </Link>
          <Link
            href={selectedCampaign ? `/wall?c=${selectedCampaign.slug}` : '/wall'}
            target="_blank"
            className={`text-xs font-semibold px-4 py-2 rounded-xl border transition ${
              selectedCampaign
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/60'
                : 'opacity-40 pointer-events-none bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            Mural ↗
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto space-y-6">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">A carregar os seus dados...</div>
        ) : campaigns.length === 0 ? (
          <div className="bg-[#0d1527] border border-slate-800/80 rounded-2xl p-12 text-center">
            <h2 className="text-lg font-bold text-white mb-2">Nenhuma campanha encontrada</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Crie a sua primeira campanha para gerar o seu link de recolha exclusivo de depoimentos.
            </p>
            <Link
              href="/dashboard/new"
              className="inline-block text-xs font-semibold px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 transition shadow-lg shadow-amber-500/10"
            >
              Criar Primeira Campanha
            </Link>
          </div>
        ) : (
          <>
            {/* Top Toolbar */}
            <div className="bg-[#0d1527] border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Campanha:</span>
                <select
                  value={selectedCampaignId}
                  onChange={handleCampaignChange}
                  className="bg-[#070b14] text-white border border-slate-700/80 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.business_name || c.name} (/c/{c.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => copyToClipboard(collectionUrl, 'link')}
                  className="text-xs font-medium px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition"
                >
                  {copySuccess === 'link' ? 'Copiado!' : 'Copiar link de recolha'}
                </button>
                <button
                  onClick={() => copyToClipboard(widgetCode, 'widget')}
                  className="text-xs font-medium px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition"
                >
                  {copySuccess === 'widget' ? 'Copiado!' : '</> Copiar widget (iFrame)'}
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 pt-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl capitalize transition ${
                    filter === tab
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                      : 'bg-[#0d1527] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tab === 'all' ? 'Todos' : tab === 'pending' ? 'Pendentes' : tab === 'approved' ? 'Aprovados' : 'Rejeitados'}
                </button>
              ))}
            </div>

            {/* Testimonials List */}
            {filteredTestimonials.length === 0 ? (
              <div className="bg-[#0d1527] border border-slate-800/80 rounded-2xl p-10 text-center text-sm text-slate-500">
                Nenhum depoimento encontrado neste filtro para esta campanha.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTestimonials.map(t => (
                  <div
                    key={t.id}
                    className="bg-[#0d1527] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {t.type}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            t.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : t.status === 'rejected'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>

                      {t.type === 'video' && t.media_url && (
                        <video
                          src={t.media_url}
                          controls
                          className="w-full rounded-xl mb-3 bg-black max-h-48 object-cover border border-slate-800"
                        />
                      )}

                      {t.type === 'audio' && t.media_url && (
                        <audio src={t.media_url} controls className="w-full mb-3" />
                      )}

                      {t.content && (
                        <p className="text-xs text-slate-300 italic mb-4 leading-relaxed line-clamp-4">
                          "{t.content}"
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-800/60">
                        <p className="text-xs font-bold text-white">{t.author_name}</p>
                        {t.author_title && (
                          <p className="text-[11px] text-slate-400">{t.author_title}</p>
                        )}
                        <p className="text-[10px] text-amber-400 mt-1">{'★'.repeat(t.rating)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800/60">
                      <button
                        onClick={() => handleUpdateStatus(t.id, 'approved')}
                        disabled={t.status === 'approved'}
                        className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 disabled:opacity-30 transition"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(t.id, 'rejected')}
                        disabled={t.status === 'rejected'}
                        className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-30 transition"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}