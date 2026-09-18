import React from 'react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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

interface WallPageProps {
  searchParams: Promise<{ c?: string }>;
}

export default async function WallOfLovePage({ searchParams }: WallPageProps) {
  const { c: campaignSlug } = await searchParams;

  let testimonials: Testimonial[] = [];
  let campaignTitle = 'O que dizem sobre nós';

  if (campaignSlug) {
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('slug', campaignSlug)
      .single();

    if (campaign) {
      campaignTitle = `O que dizem sobre ${campaign.name}`;
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('campaign_id', campaign.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      testimonials = data || [];
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-16 px-4">
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

      <div className="max-w-6xl mx-auto">
        {testimonials.length === 0 ? (
          <div className="text-center py-16 bg-[#0d1527] border border-slate-800/80 rounded-2xl max-w-md mx-auto p-8">
            <p className="text-sm text-slate-400">Ainda não existem testemunhos aprovados para este mural.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
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
                      {'★'.repeat(t.rating)}
                    </div>
                  </div>

                  {t.type === 'video' && t.media_url && (
                    <video
                      src={t.media_url}
                      controls
                      className="w-full rounded-xl mb-4 bg-black max-h-56 object-cover border border-slate-800"
                    />
                  )}

                  {t.type === 'audio' && t.media_url && (
                    <audio src={t.media_url} controls className="w-full mb-4" />
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}