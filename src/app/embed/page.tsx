'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Star, Video, Mic, MessageSquare, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';

interface Campaign {
  id: string;
  slug: string;
  business_name: string;
  plan?: string;
}

interface Testimonial {
  id: string;
  type: 'video' | 'audio' | 'text';
  author_name: string;
  author_title: string;
  content: string | null;
  media_url: string | null;
  rating: number;
  status: string;
  created_at: string;
}

function EmbedContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const loadEmbedData = async () => {
      setLoading(true);

      const { data: campData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('slug', slug)
        .single();

      if (campData) {
        setCampaign(campData);

        const { data: testData } = await supabase
          .from('testimonials')
          .select('*')
          .eq('campaign_id', campData.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (testData && testData.length > 0) {
          setTestimonials(testData);

          const urls: Record<string, string> = {};
          for (const item of testData) {
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
        }
      }

      setLoading(false);
    };

    loadEmbedData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-transparent text-slate-400 text-xs">
        A carregar testemunhos...
      </div>
    );
  }

  if (!campaign || testimonials.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center bg-transparent text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl p-6">
        Nenhum testemunho aprovado para exibição.
      </div>
    );
  }

  const isWhiteLabel = campaign.plan && campaign.plan !== 'free';

  return (
    <div className="w-full bg-transparent p-4 selection:bg-orange-500 selection:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                  {t.type === 'video' && <Video className="w-3 h-3 text-orange-400" />}
                  {t.type === 'audio' && <Mic className="w-3 h-3 text-blue-400" />}
                  {t.type === 'text' && <MessageSquare className="w-3 h-3 text-emerald-400" />}
                </span>
              </div>

              {t.type === 'video' && (
                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-3 border border-slate-800">
                  {mediaUrls[t.id] ? (
                    <video src={mediaUrls[t.id]} controls className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                      A carregar vídeo...
                    </div>
                  )}
                </div>
              )}

              {t.type === 'audio' && (
                <div className="bg-slate-950 p-3 rounded-xl mb-3 border border-slate-800">
                  {mediaUrls[t.id] ? (
                    <audio src={mediaUrls[t.id]} controls className="w-full" />
                  ) : (
                    <span className="text-xs text-slate-500">A carregar áudio...</span>
                  )}
                </div>
              )}

              {t.type === 'text' && (
                <p className="text-xs text-slate-300 italic mb-3 leading-relaxed">
                  "{t.content}"
                </p>
              )}

              <div>
                <p className="font-bold text-white text-xs">{t.author_name}</p>
                {t.author_title && (
                  <p className="text-[11px] text-slate-400">{t.author_title}</p>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verificado por Voucha
            </div>
          </div>
        ))}
      </div>

      {/* Regra White-label: Mostra marca apenas para planos não pagos */}
      {!isWhiteLabel && (
        <div className="mt-6 flex justify-center items-center">
          <a
            href="https://voucha.pt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 hover:text-white transition-colors"
          >
            <span>Alimentado por</span>
            <span className="font-bold text-orange-400">Voucha</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="text-xs text-slate-500 p-4">A carregar...</div>}>
      <EmbedContent />
    </Suspense>
  );
}