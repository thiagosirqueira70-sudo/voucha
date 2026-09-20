'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  type: 'video' | 'audio' | 'text';
  author_name: string;
  author_title: string | null;
  content: string | null;
  media_url: string | null;
  rating: number;
  created_at: string;
}

const getMediaUrl = (pathOrUrl: string | null) => {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  return `https://clcomwzpnfoxvanochpz.supabase.co/storage/v1/object/public/testimonials-media/${pathOrUrl}`;
};

function WallContent() {
  const searchParams = useSearchParams();
  const campaignSlug = searchParams.get('c');

  const [campaignTitle, setCampaignTitle] = useState('O que dizem sobre nós');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallData() {
      setLoading(true);

      if (!campaignSlug) {
        // Se não houver slug, procura os depoimentos aprovados em geral
        const { data } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        setTestimonials(data || []);
        setLoading(false);
        return;
      }

      // Procura a campanha correspondente ao slug
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('id, name, business_name')
        .eq('slug', campaignSlug.trim())
        .maybeSingle();

      if (campaign) {
        const titleName = campaign.business_name || campaign.name;
        if (titleName) {
          setCampaignTitle(`O que dizem sobre ${titleName}`);
        }

        const { data } = await supabase
          .from('testimonials')
          .select('*')
          .eq('campaign_id', campaign.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        setTestimonials(data || []);
      } else {
        setTestimonials([]);
      }

      setLoading(false);
    }

    fetchWallData();
  }, [campaignSlug]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-16 px-4">
      {/* Topo do Mural */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Prova Social Real
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white mt-4 mb-3 tracking-tight">
          {campaignTitle}
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Confira a experiência autêntica dos nossos clientes contada em primeira pessoa.
        </p>
      </div>

      {/* Área dos Cartões */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-16 text-sm text-slate-500">
            A carregar testemunhos...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16 bg-[#0d1527] border border-slate-800/80 rounded-2xl max-w-md mx-auto p-8">
            <p className="text-sm text-slate-400">
              Ainda não existem testemunhos aprovados para este mural.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => {
              const resolvedUrl = getMediaUrl(t.media_url);

              return (
                <div
                  key={t.id}
                  className="bg-[#0d1527] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t.type}
                      </span>
                      <div className="text-amber-400 text-xs">
                        {'★'.repeat(t.rating || 5)}
                      </div>
                    </div>

                    {t.type === 'video' && resolvedUrl && (
                      <div className="relative mb-4">
                        <video
                          controls
                          playsInline
                          preload="auto"
                          className="w-full rounded-xl bg-black max-h-56 object-cover border border-slate-800"
                        >
                          <source src={resolvedUrl} type="video/webm" />
                          <source src={resolvedUrl} type="video/mp4" />
                          O seu navegador não suporta este formato de vídeo.
                        </video>
                      </div>
                    )}

                    {t.type === 'audio' && resolvedUrl && (
                      <div className="mb-4">
                        <audio controls preload="auto" className="w-full">
                          <source src={resolvedUrl} type="audio/webm" />
                          <source src={resolvedUrl} type="audio/mp4" />
                        </audio>
                      </div>
                    )}

                    {t.content && (
                      <p className="text-xs text-slate-300 italic mb-4 leading-relaxed">
                        "{t.content}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/60">
                    <p className="text-xs font-bold text-white">{t.author_name}</p>
                    {t.author_title && (
                      <p className="text-[11px] text-slate-400">{t.author_title}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WallOfLovePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-500 text-sm">A carregar mural...</div>}>
      <WallContent />
    </Suspense>
  );
}