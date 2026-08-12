import { ArrowRight, Compass, Crosshair, Sparkles } from 'lucide-react';
import { PharLogo } from '@/components/phar-logo';

type IntroViewProps = { onStart: () => void };

const concepts = [
  { icon: Crosshair, label: 'DIAGNÓSTICO', text: 'Perguntas simples.' },
  { icon: Compass, label: 'VISÃO', text: 'Uma leitura diferente da sua empresa.' },
  { icon: Sparkles, label: 'AÇÃO', text: 'Próximos passos práticos.' },
];

export function IntroView({ onStart }: IntroViewProps) {
  return (
    <main className="phar-shell">
      <header className="phar-topbar phar-appear">
        <PharLogo />
        <span className="phar-eyebrow hidden sm:block">DIAGNÓSTICO EMPRESARIAL / 01</span>
      </header>
      <section className="grid min-h-[calc(100dvh-130px)] items-center gap-12 pb-6 pt-16 lg:grid-cols-[1.12fr_.88fr] lg:gap-20 lg:pt-4">
        <div className="phar-appear">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-8 bg-[hsl(var(--primary))]" />
            <span className="phar-eyebrow">Acenda o próximo sinal</span>
          </div>
          <h1 className="phar-display max-w-3xl text-[3.35rem] font-semibold text-slate-100 sm:text-7xl lg:text-[6.1rem]">
            Enxergue sua empresa <span className="text-[hsl(var(--primary))]">por outro ângulo.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            Responda algumas perguntas simples e descubra onde sua empresa está forte, onde precisa de atenção e qual pode ser seu próximo passo.
          </p>
          <button className="phar-button phar-button-primary mt-9 w-full sm:w-auto" onClick={onStart} data-testid="button-start-diagnosis">
            COMEÇAR DIAGNÓSTICO <ArrowRight size={16} />
          </button>
          <p className="mt-5 font-mono text-[.68rem] uppercase tracking-[.12em] text-slate-500">16 perguntas · cerca de 3 minutos · sem julgamento</p>
        </div>
        <div className="phar-appear-delay relative">
          <div className="absolute -inset-8 rounded-full bg-[hsl(var(--primary)/.07)] blur-3xl" />
          <div className="phar-panel relative p-5 sm:p-7">
            <div className="mb-8 flex items-center justify-between border-b border-slate-700/60 pb-5">
              <div>
                <p className="font-mono text-[.65rem] uppercase tracking-[.16em] text-slate-500">Sua leitura começa aqui</p>
                <p className="mt-2 text-sm font-semibold text-slate-200">Um farol para suas decisões</p>
              </div>
              <div className="beacon-mark phar-pulse" aria-hidden="true"><ArrowRight size={18} strokeWidth={1.5} /></div>
            </div>
            <div className="space-y-3">
              {concepts.map(({ icon: Icon, label, text }, index) => (
                <div className="group flex items-center gap-4 rounded-xl border border-slate-700/70 bg-slate-900/50 p-4 transition-colors hover:border-slate-500/70" key={label} data-testid={`card-concept-${index}`}>
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-800 text-[hsl(var(--primary))]"><Icon size={18} strokeWidth={1.6} /></div>
                  <div>
                    <p className="font-mono text-[.65rem] font-medium tracking-[.14em] text-[hsl(var(--primary))]">{label}</p>
                    <p className="mt-1 text-sm text-slate-300">{text}</p>
                  </div>
                  <ArrowRight className="ml-auto text-slate-600 transition-transform group-hover:translate-x-1" size={15} />
                </div>
              ))}
            </div>
            <div className="mt-7 flex items-center gap-3 rounded-lg bg-[hsl(var(--primary)/.07)] px-4 py-3 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))] shadow-[0_0_12px_hsl(var(--accent)/.7)]" />
              Feito para clarear o que importa agora.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}