'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Redireciona caso o usuário já esteja logado
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  useEffect(() => {
    setIsSignUp(mode === 'signup');
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Se o Supabase exigir confirmação por email
        if (data.user && !data.session) {
          setSuccessMsg('Conta criada com sucesso! Verifique a sua caixa de correio para confirmar o registo.');
        } else {
          router.push('/dashboard');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black text-white">
          {isSignUp ? 'Criar Conta Voucha' : 'Aceder à Área de Cliente'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {isSignUp
            ? 'Registe a sua empresa para começar a recolher testemunhos.'
            : 'Introduza as suas credenciais para aceder ao painel.'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Correio Eletrónico
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@empresa.pt"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Palavra-passe
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-600/20 cursor-pointer"
        >
          {loading ? 'A processar...' : isSignUp ? 'Concluir Registo' : 'Entrar na Conta'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800 text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className="text-xs text-slate-400 hover:text-orange-400 transition-colors font-medium cursor-pointer"
        >
          {isSignUp
            ? 'Já possui conta criada? Inicie sessão aqui.'
            : 'Ainda não tem conta? Crie o registo da sua empresa.'}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 selection:bg-orange-500">
      <div className="mb-8">
        <Link href="/" prefetch={false}>
          <Logo size="md" showTagline />
        </Link>
      </div>

      <Suspense fallback={<div className="text-xs text-slate-500">A carregar...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}