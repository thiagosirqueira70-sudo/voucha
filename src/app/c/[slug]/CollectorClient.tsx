'use client';

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Video, Mic, Type, Camera, StopCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CampaignProps {
  campaign: {
    id: string;
    business_name: string;
    welcome_message: string;
    thank_you_message: string;
    questions: string[];
    accent_color?: string;
  };
}

export default function CollectorClient({ campaign }: CampaignProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'text'>('video');
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const startPreview = async (type: 'video' | 'audio') => {
    try {
      stream?.getTracks().forEach((t) => t.stop());
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video',
        audio: true,
      });
      setStream(userStream);
      if (videoRef.current && type === 'video') {
        videoRef.current.srcObject = userStream;
      }
    } catch {
      alert('Por favor, autorize o acesso à câmera/microfone.');
    }
  };

  const handleStartCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          startRecording();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const mimeType = activeTab === 'video' ? 'video/webm;codecs=vp8,opus' : 'audio/webm;codecs=opus';
    const recorder = new MediaRecorder(stream, { mimeType });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: activeTab === 'video' ? 'video/webm' : 'audio/webm' });
      setMediaBlob(blob);
      setMediaUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const resetRecording = () => {
    setMediaBlob(null);
    setMediaUrl(null);
    startPreview(activeTab as 'video' | 'audio');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAccepted) {
      alert('É necessário autorizar a utilização da imagem/voz para enviar.');
      return;
    }

    setUploading(true);
    let finalMediaUrl = '';

    try {
      if (mediaBlob) {
        const fileExt = 'webm';
        const fileName = `${campaign.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('testimonials-media')
          .upload(fileName, mediaBlob, {
            contentType: activeTab === 'video' ? 'video/webm' : 'audio/webm',
            upsert: false,
          });

        if (uploadError) throw uploadError;
        finalMediaUrl = fileName;
      }

      const { error: dbError } = await supabase.from('testimonials').insert({
        campaign_id: campaign.id,
        type: activeTab,
        author_name: authorName,
        author_title: authorTitle,
        content: activeTab === 'text' ? textContent : null,
        media_url: finalMediaUrl || null,
        consent_accepted: consentAccepted,
        status: 'pending',
      });

      if (dbError) throw dbError;

      setSubmitted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      alert(`Erro no envio: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Muito Obrigado!</h2>
          <p className="text-slate-400">{campaign.thank_you_message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-black mb-2">{campaign.business_name}</h1>
          <p className="text-sm text-slate-400">{campaign.welcome_message}</p>
        </header>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-6">
          <p className="text-xs uppercase font-bold text-slate-400 mb-2">Perguntas-Guia:</p>
          <ul className="text-sm space-y-1 text-slate-300 list-disc list-inside">
            {campaign.questions?.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('video'); startPreview('video'); }}
            className={`flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'video' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Video className="w-4 h-4" /> Vídeo
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('audio'); startPreview('audio'); }}
            className={`flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'audio' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Mic className="w-4 h-4" /> Áudio
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('text'); stream?.getTracks().forEach(t => t.stop()); setStream(null); }}
            className={`flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'text' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Type className="w-4 h-4" /> Texto
          </button>
        </div>

        {activeTab === 'video' && (
          <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden mb-6 flex items-center justify-center border border-slate-800">
            {countdown !== null && (
              <span className="absolute z-20 text-7xl font-black text-orange-500 animate-ping">{countdown}</span>
            )}
            {!mediaUrl ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
                {!recording && !countdown && (
                  <button
                    type="button"
                    onClick={handleStartCountdown}
                    className="absolute bottom-4 z-10 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Camera className="w-5 h-5" /> Começar a Gravar
                  </button>
                )}
                {recording && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="absolute bottom-4 z-10 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full flex items-center gap-2 shadow-lg animate-pulse cursor-pointer"
                  >
                    <StopCircle className="w-5 h-5" /> Parar Gravação
                  </button>
                )}
              </>
            ) : (
              <div className="relative w-full h-full">
                <video src={mediaUrl} controls className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={resetRecording}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-full border border-slate-700 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center mb-6">
            {!mediaUrl ? (
              <div>
                {!recording && !countdown && (
                  <button
                    type="button"
                    onClick={handleStartCountdown}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Mic className="w-5 h-5" /> Gravar Voz
                  </button>
                )}
                {countdown !== null && <p className="text-4xl font-bold text-orange-500">{countdown}</p>}
                {recording && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full inline-flex items-center gap-2 animate-pulse cursor-pointer"
                  >
                    <StopCircle className="w-5 h-5" /> Parar Gravação
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <audio src={mediaUrl} controls className="w-full" />
                <button
                  type="button"
                  onClick={resetRecording}
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Gravar novamente
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'text' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">O seu depoimento</label>
              <textarea
                required
                rows={4}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Conte-nos como foi a sua experiência..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">O seu Nome</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Ex: João Pereira"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Cargo / Descrição (Opcional)</label>
            <input
              type="text"
              value={authorTitle}
              onChange={(e) => setAuthorTitle(e.target.value)}
              placeholder="Ex: Cliente / Aluno"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 text-white"
            />
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
            <input
              type="checkbox"
              id="consent"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="mt-1 accent-orange-500 cursor-pointer"
            />
            <label htmlFor="consent" className="text-xs text-slate-400 cursor-pointer leading-relaxed">
              Autorizo expressamente a utilização e divulgação da minha imagem, voz ou texto pelo estabelecimento para efeitos de prova social e divulgação institucional (RGPD).
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || (!mediaBlob && activeTab !== 'text')}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg text-sm cursor-pointer"
          >
            {uploading ? 'A enviar depoimento...' : 'Enviar Depoimento'}
          </button>
        </form>
      </div>
    </div>
  );
}