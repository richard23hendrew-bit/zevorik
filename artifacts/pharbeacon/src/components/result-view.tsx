import { ArrowRight, CheckCircle2, Compass, RefreshCw, Target } from 'lucide-react';
import type { Diagnosis, SemanticLevel, Signal } from '@/lib/analysis';
import { PharLogo } from '@/components/phar-logo';

type ResultViewProps = { diagnosis: Diagnosis; onReset: () => void };

const levelStyle: Record<SemanticLevel, { dot: string; text: string; label: string }> = {
  destaque: { dot: 'bg-[hsl(var(--primary))]', text: 'text-[hsl(var(--primary))]', label: 'DESTAQUE' },
  forte: { dot: 'bg-[hsl(var(--accent))]', text: 'text-[hsl(var(--accent))]', label: 'FORTE' },
  atenção: { dot: 'bg-yellow-400', text: 'text-yellow-300', label: 'ATENÇÃO' },
  alerta: { dot: 'bg-orange-400', text: 'text-orange-300', label: 'ALERTA' },
  crítico: { dot: 'bg-red-400', text: 'text-red-300', label: 'CRÍTICO' },
};

function SignalCard({ item, index }: { item: Signal; index: number }) {
  const style = levelStyle[item.level];
  return (
    <div className="phar-panel p-5 transition-transform hover:-translate-y-1" data-testid={`card-priority-${index}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`flex items-center gap-2 font-mono text-[.62rem] tracking-[.15em] ${style.text}`}>
          <span className={`h-2 w-2 rounded-full ${style.dot}`} /> {style.label}
        </span>
        <span className="font-mono text-[.65rem] text-slate-600">0{index + 1}</span>
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-100">{item.category}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{item.reason}</p>
    </div>
  );
}

export function ResultView({ diagnosis, onReset }: ResultViewProps) {
  return (
    <main className="phar-shell">
      <header className="phar-topbar phar-appear">
        <PharLogo />
        <button className="phar-button phar-button-ghost min-h-10 px-3 text-[.62rem]" onClick={onReset} data-testid="button-redo-diagnosis"><RefreshCw size={14} /> REFAZER</button>
      </header>
      <section className="mt-14 max-w-4xl phar-appear">
        <p className="phar-eyebrow">PHARBEACON / SUA LEITURA</p>
        <h1 className="phar-display mt-5 max-w-3xl text-5xl font-semibold text-slate-100 sm:text-7xl" data-testid="heading-result">Um novo ângulo para decidir.</h1>
        <div className="phar-panel mt-8 border-[hsl(var(--primary)/.25)] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))]"><Compass size={19} /></div>
            <div>
              <p className="font-mono text-[.65rem] uppercase tracking-[.15em] text-[hsl(var(--primary))]">VISÃO GERAL</p>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300" data-testid="text-overview">{diagnosis.overview}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-14 phar-appear-delay">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="phar-eyebrow">01 / FOCO</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">PRINCIPAL PRIORIDADE</h2>
          </div>
          <Target className="hidden text-[hsl(var(--primary))] sm:block" size={23} strokeWidth={1.5} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {diagnosis.priorities.length ? diagnosis.priorities.map((item, index) => <SignalCard item={item} index={index} key={`${item.category}-${index}`} />) : <div className="phar-panel p-6 text-sm text-slate-400">Sua leitura está pronta. Use o próximo passo para transformar clareza em movimento.</div>}
        </div>
      </section>
      <section className="mt-14 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="phar-panel p-6 sm:p-8">
          <p className="phar-eyebrow">02 / BASE</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-100">O QUE SUA EMPRESA ESTÁ FAZENDO BEM</h2>
          <div className="mt-7 space-y-4">
            {diagnosis.strengths.map((item, index) => (
              <div className="flex gap-3" key={`${item.category}-${index}`} data-testid={`strength-${index}`}>
                <CheckCircle2 className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" size={18} />
                <div><p className="text-sm font-semibold text-slate-200">{item.category}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.reason}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.45rem] border border-[hsl(var(--primary)/.25)] bg-[linear-gradient(145deg,hsl(196_96%_62%/.12),hsl(222_36%_11%/.8))] p-6 sm:p-8">
          <p className="phar-eyebrow">03 / MOVIMENTO</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-100">SEU PRÓXIMO PASSO</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Comece por <span className="font-semibold text-slate-200">{diagnosis.nextStep.category.toLowerCase()}</span>. Uma ação concreta vale mais que uma lista longa.</p>
          <ol className="mt-7 space-y-4">
            {diagnosis.nextStep.steps.map((step, index) => (
              <li className="flex items-start gap-4" key={step} data-testid={`next-step-${index}`}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[hsl(var(--primary)/.16)] font-mono text-xs text-[hsl(var(--primary))]">{index + 1}</span>
                <span className="pt-1 text-sm leading-5 text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
          <button className="phar-button phar-button-primary mt-8 w-full sm:w-auto" onClick={onReset} data-testid="button-new-diagnosis">FAZER NOVAMENTE <ArrowRight size={16} /></button>
        </div>
      </section>
      <footer className="mt-16 border-t border-slate-800 pt-6 text-center font-mono text-[.62rem] uppercase tracking-[.12em] text-slate-600">Sua empresa muda. Sua leitura também.</footer>
    </main>
  );
}