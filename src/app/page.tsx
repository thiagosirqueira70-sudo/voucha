'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Lock,
  Building2,
  FileCheck2,
  Play,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Gratuito',
      tagline: 'Para testar e recolher os seus primeiros testemunhos.',
      priceMonthly: '0€',
      priceAnnual: '0€',
      subtextMonthly: '/mês',
      subtextAnnual: '/ano',
      annualNote: null,
      highlight: false,
      badge: null,
      features: [
        '2 testemunhos em vídeo/voz',
        'Até 10 testemunhos em texto',
        '1 campanha ativa',
        'Widget com marca Voucha',
        'Transcrição e destaques por IA'
      ],
      cta: 'Começar Grátis',
      ctaStyle: 'bg-white hover:bg-slate-100 text-slate-950 font-bold border border-slate-200'
    },
    {
      name: 'Pro',
      tagline: 'Para empresas em crescimento que vendem com prova social.',
      priceMonthly: '19€',
      priceAnnual: '190€',
      subtextMonthly: '/mês',
      subtextAnnual: '/ano',
      annualNote: 'Equivalente a 15,83€/mês — pague 10 meses, utilize 12',
      highlight: true,
      badge: 'MAIS POPULAR',
      features: [
        'Testemunhos ilimitados (texto, vídeo, voz)',
        'Campanhas ilimitadas',
        'Widget sem marca Voucha (White-label)',
        'Transcrição e destaques por IA',
        'Exportação de dados em CSV'
      ],
      cta: 'Iniciar teste de 14 dias',
      ctaStyle: 'bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-600/30'
    },
    {
      name: 'Growth',
      tagline: 'Para equipas estruturadas que já utilizam testemunhos nas vendas.',
      priceMonthly: '39€',
      priceAnnual: '390€',
      subtextMonthly: '/mês',
      subtextAnnual: '/ano',
      annualNote: 'Equivalente a 32,50€/mês — pague 10 meses, utilize 12',
      highlight: false,
      badge: null,
      features: [
        'Tudo incluído no Pro, e mais:',
        'Exportação de vídeos pronta para Reels/TikTok',
        'Resumo semanal por correio eletrónico',
        'Murais em Inglês e Português',
        'Suporte prioritário por email'
      ],
      cta: 'Iniciar teste de 14 dias',
      ctaStyle: 'bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-700'
    },
    {
      name: 'Agency',
      tagline: 'Para agências digitais e gestores de múltiplas marcas.',
      priceMonthly: '99€',
      priceAnnual: '990€',
      subtextMonthly: '/mês',
      subtextAnnual: '/ano',
      annualNote: 'Equivalente a 82,50€/mês — pague 10 meses, utilize 12',
      highlight: false,
      badge: null,
      features: [
        'Tudo incluído no Growth, e mais:',
        'Múltiplas marcas e clientes numa única conta',
        'Onboarding individual guiado (1:1)',
        'Suporte direto via WhatsApp',
        'Acesso prioritário a novas funcionalidades'
      ],
      cta: 'Iniciar teste de 14 dias',
      ctaStyle: 'bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-700'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Top Banner RGPD */}
      <div className="bg-slate-900/90 border-b border-slate-800 text-[11px] py-2 px-4 text-center text-slate-400">
        <span className="font-semibold text-orange-400 mr-2">Conformidade RGPD:</span> 
        Servidores dedicados na União Europeia e termo de cessão de direitos de imagem gerado a cada submissão.
      </div>

      {/* Navbar Institucional */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" showTagline />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#conformidade" className="hover:text-white transition-colors">Segurança & RGPD</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos & Preços</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              prefetch={false}
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Área de Cliente
            </Link>
            <Link
              href="/login?mode=signup"
              prefetch={false}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-600/20"
            >
              Criar Conta <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-orange-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Prova Social Estruturada para Empresas em Portugal
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white max-w-4xl mx-auto">
            O seu cliente elogia o seu trabalho. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              Converta esse elogio num contrato fechado.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Elimine a barreira técnica de pedir recomendações. Envie uma ligação exclusiva e permita que os seus clientes gravem testemunhos em vídeo ou voz em 60 segundos, sem registos ou instalações.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login?mode=signup"
              prefetch={false}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-600/25"
            >
              Iniciar Recolha Imediata <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="/wall"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 text-orange-400" /> Ver Exemplo do Mural
            </a>
          </div>

          {/* Destaque com Métricas */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border-t border-slate-900 text-left">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
              <span className="block text-2xl sm:text-3xl font-black text-white">88%</span>
              <span className="text-xs text-slate-400 leading-snug block mt-1">dos decisores B2B consultam testemunhos antes de adjudicar propostas.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
              <span className="block text-2xl sm:text-3xl font-black text-orange-400">3.8x</span>
              <span className="text-xs text-slate-400 leading-snug block mt-1">aumento na taxa de conversão em websites com prova social em vídeo.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">100%</span>
              <span className="text-xs text-slate-400 leading-snug block mt-1">em conformidade jurídica com os regulamentos da União Europeia.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900">
              <span className="block text-2xl sm:text-3xl font-black text-white">&lt; 2 min</span>
              <span className="text-xs text-slate-400 leading-snug block mt-1">tempo médio que o seu cliente demora a submeter um testemunho completo.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Como Funciona */}
      <section id="como-funciona" className="py-24 px-6 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Do pedido à publicação no seu site sem complicações.
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Criado para remover atrito operacional. O seu cliente não precisa de criar conta nem instalar qualquer software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-orange-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Envie a sua ligação de recolha</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Configure as perguntas orientadoras para o cliente não ficar sem saber o que dizer. Envie o link por email comercial ou WhatsApp.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-orange-400 border border-slate-700 font-black flex items-center justify-center text-sm shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-white">O cliente grava em qualquer ecrã</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Diretamente no telemóvel ou computador, ele escolhe gravar um vídeo autêntico, enviar uma mensagem de voz ou redigir um texto.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 font-black flex items-center justify-center text-sm shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Aprovação e publicação com 1 clique</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Nenhum testemunho vai para o ar sem a sua autorização. Aprove o conteúdo no painel e ele atualiza automaticamente o widget no seu site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Jurídica & RGPD */}
      <section id="conformidade" className="py-24 px-6 border-b border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" /> Segurança Jurídica Garantida
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Total tranquilidade legal para si e para o seu cliente.
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Em Portugal e no espaço europeu, publicar o rosto ou a voz de um cliente sem o consentimento correto constitui uma infração grave do RGPD. O Voucha resolve a questão jurídica de ponta a ponta.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <FileCheck2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong>Consentimento explícito e auditável:</strong> cada submissão gera um registo com timestamp e autorização prévia.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong>Dados residentes na União Europeia:</strong> ficheiros de vídeo e áudio armazenados em centros de dados com alta conformidade.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong>Acordo de Tratamento de Dados (DPA):</strong> pronto para responder às exigências jurídicas da sua empresa.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white">Como o seu cliente visualiza a recolha:</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">1. Gravação do Testemunho</span>
                <span className="text-emerald-400 font-semibold">Vídeo / Áudio / Texto</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">2. Identificação Profissional</span>
                <span className="text-slate-400">Nome e Cargo / Empresa</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">3. Cláusula de Cessão de Imagem</span>
                <span className="text-emerald-400 font-semibold">Aceitação Obrigatória</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 leading-relaxed">
              O cliente só conclui o envio após aceitar expressamente a exibição do testemunho nos seus canais institucionais.
            </div>
          </div>
        </div>
      </section>

      {/* Seção Planos e Preços */}
      <section id="planos" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Seletor de Periodicidade */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="inline-flex items-center bg-slate-900 p-1 rounded-full border border-slate-800">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly' ? 'bg-black text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensal
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'annual' ? 'bg-black text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Anual <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-extrabold">2 meses grátis</span>
              </button>
            </div>
          </div>

          {/* Grid com os 4 Planos em Euros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((p) => {
              const isAnnual = billingCycle === 'annual';
              const price = isAnnual ? p.priceAnnual : p.priceMonthly;
              const subtext = isAnnual ? p.subtextAnnual : p.subtextMonthly;

              return (
                <div
                  key={p.name}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                    p.highlight
                      ? 'bg-zinc-950 border-2 border-slate-800 shadow-2xl relative lg:-translate-y-2'
                      : 'bg-slate-900/50 border border-slate-800'
                  }`}
                >
                  {p.badge && (
                    <div className="absolute -top-3 left-6">
                      <span className="px-3 py-1 rounded-md bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                        {p.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xl font-bold text-white">{p.name}</h3>
                      <p className="text-xs text-slate-400 mt-2 min-h-[34px] leading-relaxed">{p.tagline}</p>
                    </div>

                    <div className="pt-2 border-b border-slate-800/80 pb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-white">{price}</span>
                        <span className="text-xs text-slate-400 font-medium">{subtext}</span>
                      </div>
                      {isAnnual && p.annualNote && (
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">{p.annualNote}</p>
                      )}
                    </div>

                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/login?mode=signup"
                      prefetch={false}
                      className={`w-full py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${p.ctaStyle}`}
                    >
                      {p.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rodapé Institucional */}
      <footer className="border-t border-slate-900 bg-slate-950 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="space-y-4 max-w-sm">
            <Logo size="md" showTagline />
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma empresarial para recolha, aprovação e incorporação de recomendações e testemunhos autênticos de clientes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs text-slate-400">
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Plataforma</h4>
              <ul className="space-y-2">
                <li><a href="#como-funciona" className="hover:text-white">Como Funciona</a></li>
                <li><a href="#planos" className="hover:text-white">Planos & Preços</a></li>
                <li><a href="/wall" target="_blank" rel="noreferrer" className="hover:text-white">Exemplo de Mural</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Segurança</h4>
              <ul className="space-y-2">
                <li><a href="#conformidade" className="hover:text-white">Termos RGPD</a></li>
                <li><span className="text-slate-500">Servidores na UE</span></li>
                <li><span className="text-slate-500">DPA & Privacidade</span></li>
              </ul>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Acesso Rápido</h4>
              <ul className="space-y-2">
                <li><Link href="/login" prefetch={false} className="text-orange-400 font-semibold hover:underline">Área de Cliente (Entrar)</Link></li>
                <li><Link href="/login?mode=signup" prefetch={false} className="hover:text-white">Criar Registo de Empresa</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Voucha Business. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>Desenvolvido para empresas de alta performance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}