import { Activity, ScanLine } from 'lucide-react';
import { PharLogo } from '@/components/phar-logo';

export function LoadingView() {
  return (
    <main className="phar-shell flex min-h-[100dvh] flex-col">
      <header className="phar-topbar">
        <PharLogo />
        <span className="phar-eyebrow">SINAL RECEBIDO</span>
      </header>
      <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-10 grid h-28 w-28 place-items-center">
          <div className="absolute inset-0 rounded-full border border-[hsl(var(--primary)/.28)]" />
          <div className="absolute inset-3 rounded-full border border-dashed border-[hsl(var(--primary)/.4)] phar-pulse" />
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))]"><ScanLine size={27} strokeWidth={1.3} /></div>
        </div>
        <p className="phar-eyebrow">PHARBEACON / PROCESSANDO</p>
        <h1 className="phar-display mt-5 text-4xl font-semibold text-slate-100 sm:text-6xl" data-testid="status-analysis">Analisando sua empresa...</h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-slate-400" data-testid="text-analysis-subtitle">Cruzando suas respostas para encontrar os sinais mais importantes.</p>
        <div className="mt-10 flex items-center gap-2 font-mono text-[.67rem] uppercase tracking-[.12em] text-slate-600">
          <Activity size={14} className="text-[hsl(var(--accent))]" /> leitura em andamento
        </div>
      </section>
    </main>
  );
}