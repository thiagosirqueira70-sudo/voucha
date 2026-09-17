'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';
import { 
  CheckCircle, 
  XCircle, 
  Mic, 
  Video, 
  MessageSquare, 
  ShieldCheck, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2,
  Plus,
  LogOut,
  Download
} from 'lucide-react';

interface Campaign {
  id: string;
  slug: string;
  business_name: string;
}

interface Testimonial {
  id: string;
  campaign_id: string;
  type: 'video' | 'audio' | 'text';
  author_name: string;
  author_title: string;
  content: string | null;
  media_url: string | null;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  consent_accepted: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const checkUserAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    await fetchCampaigns();
    await fetchTestimonials();
  };

  const fetchCampaigns = async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('id, slug, business_name')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setCampaigns(data);
      setSelectedCampaign(data[0]);
    }
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTestimonials(data);
      gerarUrlsAssinadas(data);
    }
    setLoading(false);
  };

  const gerarUrlsAssinadas = async (items: Testimonial[]) => {
    const urls: Record<string, string> = {};
    for (const item of items) {
      if (item.media_url) {
        const { data } = await supabase.storage
          .from('testimonials-media')
          .createSignedUrl(item.media_url, 3600);

        if (data?.signedUrl) {
          urls[item.id] = data.signedUrl;
        }
      }
    }
    setMediaUrls(urls);
  };

  useEffect(() => {
    checkUserAndLoad();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('testimonials')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } else {
      alert(`Erro ao atualizar: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleExportCSV = () => {
    const approved = testimonials.filter(t => t.status === 'approved');
    if (approved.length === 0) {
      alert('Não existem testemunhos aprovados para exportar.');
      return;
    }

    const headers = ['Tipo', 'Autor', 'Cargo/Empresa', 'Classificacao', 'Data', 'Conteudo'];
    const rows = approved.map(t => [
      t.type,
      `"${t.author_name.replace(/"/g, '""')}"`,
      `"${(t.author_title || '').replace(/"/g, '""')}"`,
      t.rating,
      t.created_at,
      `"${(t.content || t.media_url || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `testemunhos-${selectedCampaign?.slug || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentSlug = selectedCampaign?.slug || 'campanha-teste';

  const handleCopyLink = () => {
    const link = `${window.location.origin}/c/${currentSlug}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    const iframeCode = `<iframe src="${window.location.origin}/embed?slug=${currentSlug}" width="100%" height="600" frameborder="0" style="border:none; overflow:hidden;"></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const filtered = testimonials.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 selection:bg-orange-500">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <header className="pb-8 border-b border-slate-800 mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Logo size="md" />
              <div className="border-l border-slate-800 pl-4">
                <h1 className="text-xl font-bold tracking-tight">Área de Moderação</h1>
                <p className="text-slate-400 text-xs mt-0.5">Gestão de testemunhos e campanhas.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCSV}
                title="Descarregar ficheiro CSV com os testemunhos aprovados"
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" /> Exportar CSV
              </button>

              <Link
                href="/dashboard/new"
                prefetch={false}
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Nova Campanha
              </Link>

              <a
                href="/wall"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                Mural <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleLogout}
                title="Terminar Sessão"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Barra de Campanha Selecionada */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Campanha Ativa:</span>
              {campaigns.length > 0 ? (
                <select
                  value={selectedCampaign?.slug}
                  onChange={(e) => {
                    const found = campaigns.find((c) => c.slug === e.target.value);
                    if (found) setSelectedCampaign(found);
                  }}
                  className="bg-slate-950 border border-slate-700 text-orange-400 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.slug} className="bg-slate-900 text-white">
                      {c.business_name} (/c/{c.slug})
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-slate-500">Nenhuma campanha cadastrada</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer text-slate-200"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-400" />}
                {copiedLink ? 'Link copiado!' : 'Copiar link de recolha'}
              </button>

              <button
                onClick={handleCopyEmbed}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer text-slate-200"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5 text-blue-400" />}
                {copiedEmbed ? 'Código copiado!' : 'Copiar widget (iFrame)'}
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    activeFilter === filter ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter === 'all' ? 'Todos' : filter === 'pending' ? 'Pendentes' : filter === 'approved' ? 'Aprovados' : 'Rejeitados'}
                </button>
              ))}
            </div>

            <button
              onClick={fetchTestimonials}
              title="Atualizar lista"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Listagem de Depoimentos */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-xs">A carregar testemunhos...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <p className="text-slate-400 text-xs">Nenhum testemunho encontrado neste filtro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                      {item.type === 'video' && <Video className="w-3.5 h-3.5 text-orange-400" />}
                      {item.type === 'audio' && <Mic className="w-3.5 h-3.5 text-blue-400" />}
                      {item.type === 'text' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                      <span className="capitalize">{item.type}</span>
                    </span>

                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {item.status === 'approved' ? 'Aprovado' : item.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                    </span>
                  </div>

                  {item.type === 'video' && (
                    <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-slate-800 flex items-center justify-center">
                      {mediaUrls[item.id] ? (
                        <video src={mediaUrls[item.id]} controls className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-500">A carregar vídeo...</span>
                      )}
                    </div>
                  )}

                  {item.type === 'audio' && (
                    <div className="bg-slate-950 p-4 rounded-xl mb-4 border border-slate-800">
                      {mediaUrls[item.id] ? (
                        <audio src={mediaUrls[item.id]} controls className="w-full" />
                      ) : (
                        <span className="text-xs text-slate-500">A carregar áudio...</span>
                      )}
                    </div>
                  )}

                  {item.type === 'text' && (
                    <blockquote className="bg-slate-950 p-4 rounded-xl mb-4 border border-slate-800 text-sm text-slate-300 italic leading-relaxed">
                      "{item.content}"
                    </blockquote>
                  )}

                  <div className="mb-4">
                    <p className="font-bold text-white text-base">{item.author_name}</p>
                    {item.author_title && (
                      <p className="text-xs text-slate-400">{item.author_title}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center text-xs text-slate-400 gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RGPD OK
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Aprovar
                      </button>
                    )}

                    {item.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'rejected')}
                        className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all border border-rose-500/30 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Rejeitar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}