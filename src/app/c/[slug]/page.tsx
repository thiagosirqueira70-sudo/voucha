import React from 'react';
import { supabase } from '@/lib/supabase';
import CollectorClient from './CollectorClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectorPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !campaign) {
    notFound();
  }

  return <CollectorClient campaign={campaign} />;
}