import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Voucha Business | Gestão e Recolha de Testemunhos em Portugal',
  description:
    'Plataforma institucional para empresas e profissionais recolherem testemunhos autênticos em vídeo, áudio e texto. Totalmente em conformidade com o RGPD.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-950 text-white antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}