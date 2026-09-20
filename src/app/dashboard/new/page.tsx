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
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [questions, setQuestions] = useState<string[]>(['']);
  const [countdown, setCountdown] = useState<number>(3);
  const [language, setLanguage] = useState<'pt-PT' | 'en' | 'es'>('pt-PT');
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

  const handleAddQuestion = () => {
    if (questions.length < 4) {
      setQuestions([...questions, '']);
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
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

      const cleanQuestions = questions.map((q) => q.trim()).filter(Boolean);

      const defaultWelcome =
        language === 'pt-PT'
          ? 'Olá! Gostaríamos muito de conhecer a sua experiência connosco. Demora menos de 2 minutos.'
          : language === 'es'
          ? '¡Hola! Nos encantaría conocer tu experiencia con nosotros. Toma menos de 2 minutos.'
          : 'Hi! We would love to hear about your experience with us. It takes less than 2 minutes.';

      const defaultThankYou =
        language === 'pt-PT'
          ? 'Muito obrigado pelo seu testemunho!'
          : language === 'es'
          ? '¡Muchas gracias por tu testimonio!'
          : 'Thank you very much for your testimonial!';

      const payload = {
        business_name: name,
        slug: slug.trim(),
        welcome_message: welcomeMessage || defaultWelcome,
        message: welcomeMessage || defaultWelcome,
        thank_you_message: thankYouMessage || defaultThankYou,
        questions: cleanQuestions,
        guide_questions: cleanQuestions,
        countdown_seconds: countdown,
        language: language,
        user_id: user.id,
      };

      const { error: insertError } = await supabase.from('campaigns').insert([payload]);

      if (insertError) {
        throw insertError;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar a campanha. Tente outro endereço/slug.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-xl bg-[#0d1527] border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Nova campanha</h1>
            <p className="text-xs text-slate-400 mt-1">Configure a sua página personalizada de recolha.</p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition"
          >
            Voltar
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do negócio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Nome do negócio
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

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Link da página (Slug)
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
          </div>

          {/* Mensagem de boas-vindas */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mensagem de boas-vindas
            </label>
            <textarea
              rows={3}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Ex: Olá! Gostaríamos muito de conhecer a sua experiência connosco. Demora menos de 2 minutos."
              className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Mensagem de agradecimento */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-0.5">
              Mensagem de agradecimento
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Aparece no ecrã após o envio do testemunho. Se deixar em branco, usamos uma mensagem padrão.
            </p>
            <textarea
              rows={3}
              maxLength={500}
              value={thankYouMessage}
              onChange={(e) => setThankYouMessage(e.target.value)}
              placeholder="Ex: Muito obrigado! Como agradecimento, utilize o código OBRIGADO10 para obter 10% de desconto."
              className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
            />
            <div className="text-right text-[10px] text-slate-500 mt-1">
              {thankYouMessage.length}/500
            </div>
          </div>

          {/* Perguntas guias */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-0.5">
              Perguntas-guia (até 4)
            </label>
            <p className="text-[11px] text-slate-500 mb-3">
              Apresentadas na página de recolha como sugestões para o cliente.
            </p>
            <div className="space-y-2.5">
              {questions.map((q, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold w-4 text-center">{idx + 1}</span>
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => handleQuestionChange(idx, e.target.value)}
                    placeholder={`Pergunta ${idx + 1} (ex: O que achou do nosso atendimento?)`}
                    className="flex-1 bg-[#070b14] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-xs text-rose-400 hover:text-rose-300 p-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {questions.length < 4 && (
              <button
                type="button"
                onClick={handleAddQuestion}
                className="mt-3 text-xs font-semibold text-amber-500 hover:text-amber-400 transition"
              >
                + Adicionar pergunta
              </button>
            )}
          </div>

          {/* Contagem decrescente antes de gravar */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-0.5">
              Contagem decrescente antes de gravar
            </label>
            <p className="text-[11px] text-slate-500 mb-3">
              Tempo para o cliente se preparar antes da gravação de vídeo ou áudio.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Desligado', val: 0 },
                { label: '3s', val: 3 },
                { label: '5s', val: 5 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setCountdown(item.val)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition ${
                    countdown === item.val
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                      : 'border-slate-800 bg-[#070b14] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Idioma da página de recolha */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-0.5">
              Idioma da página de recolha
            </label>
            <p className="text-[11px] text-slate-500 mb-3">
              Define o idioma apresentado na página pública de gravação.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('pt-PT')}
                className={`py-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                  language === 'pt-PT'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                    : 'border-slate-800 bg-[#070b14] text-slate-400 hover:border-slate-700'
                }`}
              >
                🇵🇹 Português (PT)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                  language === 'en'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                    : 'border-slate-800 bg-[#070b14] text-slate-400 hover:border-slate-700'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('es')}
                className={`py-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                  language === 'es'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                    : 'border-slate-800 bg-[#070b14] text-slate-400 hover:border-slate-700'
                }`}
              >
                🇪🇸 Español
              </button>
            </div>
          </div>

          {/* Botão Submeter */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-bold text-slate-950 rounded-xl text-sm transition shadow-lg shadow-amber-500/10 disabled:opacity-50 mt-4"
          >
            {loading ? 'A criar campanha...' : 'Criar campanha'}
          </button>
        </form>
      </div>
    </div>
  );
}