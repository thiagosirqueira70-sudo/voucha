import { supabase } from '@/lib/supabase';
import CollectorClient from './CollectorClient';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Busca executada no Node.js (Servidor) - Imune a CORS de navegador
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-xl font-bold mb-2">Campanha "{slug}" não encontrada</h2>
        <p className="text-slate-400 text-sm">
          {error ? `Erro do banco: ${error.message}` : 'Verifique se a campanha existe e se is_active está true.'}
        </p>
      </div>
    );
  }

  return <CollectorClient campaign={campaign} />;
}