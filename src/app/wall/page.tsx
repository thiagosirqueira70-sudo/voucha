export const dynamic = 'force-dynamic';
import React from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Video, Mic, MessageSquare, Quote } from 'lucide-react';

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

export default async function WallOfLovePage() {
  // 1. Busca no servidor apenas os depoimentos APROVADOS
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <p className="text-slate-400">Erro ao carregar o mural: {error.message}</p>
      </div>
    );
  }

  // 2. Gera URLs assinadas para os arquivos de vídeo/áudio
  const mediaMap: Record<string, string> = {};
  if (testimonials) {
    for (const item of testimonials) {
      if (item.media_url) {
        const { data } = await supabase.storage
          .from('testimonials-media')
          .createSignedUrl(item.media_url, 86400); // Válido por 24h

        if (data?.signedUrl) {
          mediaMap[item.id] = data.signedUrl;
        }
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-orange-500 selection:text-white py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho do Mural */}
        <header className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-4">
            <Quote className="w-3 h-3" /> Prova Social Real
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
            O que dizem sobre nós
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Confira a experiência autêntica dos nossos clientes e alunos contada em primeira pessoa.
          </p>
        </header>

        {/* Lista / Grade de Provas Sociais */}
        {!testimonials || testimonials.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/40 max-w-md mx-auto">
            <p className="text-slate-400">Ainda não há depoimentos aprovados para exibição pública.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {testimonials.map((item: Testimonial) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Tipo de Depoimento e Estrelas */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300">
                      {item.type === 'video' && <Video className="w-3.5 h-3.5 text-orange-400" />}
                      {item.type === 'audio' && <Mic className="w-3.5 h-3.5 text-blue-400" />}
                      {item.type === 'text' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                      <span className="capitalize">{item.type}</span>
                    </span>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Player de Vídeo Adaptativo (Suporta 16:9 de desktop e 9:16 de smartphone) */}
                  {item.type === 'video' && (
                    <div className="w-full max-h-[480px] bg-black/60 rounded-2xl overflow-hidden mb-5 border border-slate-800 shadow-inner flex items-center justify-center">
                      {mediaMap[item.id] ? (
                        <video
                          src={mediaMap[item.id]}
                          controls
                          playsInline
                          className="w-full h-auto max-h-[480px] object-contain rounded-2xl"
                          preload="metadata"
                        />
                      ) : (
                        <div className="w-full py-12 flex items-center justify-center text-xs text-slate-500">
                          Vídeo indisponível
                        </div>
                      )}
                    </div>
                  )}

                  {/* Player de Áudio */}
                  {item.type === 'audio' && (
                    <div className="bg-slate-950 p-4 rounded-2xl mb-5 border border-slate-800">
                      {mediaMap[item.id] ? (
                        <audio src={mediaMap[item.id]} controls className="w-full" />
                      ) : (
                        <div className="text-xs text-slate-500 text-center">Áudio indisponível</div>
                      )}
                    </div>
                  )}

                  {/* Texto do Depoimento */}
                  {item.type === 'text' && (
                    <blockquote className="text-slate-200 text-sm leading-relaxed italic mb-5 relative pl-4 border-l-2 border-orange-500">
                      "{item.content}"
                    </blockquote>
                  )}
                </div>

                {/* Dados do Autor */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-xs">
                    {item.author_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-white">{item.author_name}</h2>
                    {item.author_title && (
                      <p className="text-xs text-slate-400">{item.author_title}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}