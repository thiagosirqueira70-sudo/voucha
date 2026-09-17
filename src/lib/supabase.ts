import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

// Garante uma URL HTTPS válida mesmo se a variável não estiver presente no momento do build estático
const supabaseUrl = rawUrl && rawUrl.startsWith('http')
  ? rawUrl
  : 'https://clcomwzpnfoxvanochpz.supabase.co';

const supabaseAnonKey = rawKey && rawKey.length > 10
  ? rawKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummyKeyForStaticBuildEvaluationOnly';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);