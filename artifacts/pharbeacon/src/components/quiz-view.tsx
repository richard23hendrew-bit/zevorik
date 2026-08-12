import { ArrowLeft, ArrowRight, Check, CircleHelp } from 'lucide-react';
import { questions, type Answers } from '@/data/questions';

type QuizViewProps = {
  questionIndex: number;
  answers: Answers;
  onAnswer: (id: number, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function QuizView({ questionIndex, answers, onAnswer, onNext, onPrevious }: QuizViewProps) {
  const question = questions[questionIndex];
  const answer = answers[question.id] ?? '';
  const isLast = questionIndex === questions.length - 1;
  const canContinue = answer.trim().length > 0;
  const progress = ((questionIndex + 1) / questions.length) * 100;

  return (
    <main className="phar-shell">
      <header className="phar-topbar phar-appear">
        <span className="phar-eyebrow">PHARBEACON / LEITURA EM ANDAMENTO</span>
        <span className="font-mono text-[.7rem] text-slate-500">{String(questionIndex + 1).padStart(2, '0')} / 16</span>
      </header>
      <div className="mx-auto mt-10 max-w-3xl phar-appear">
        <div className="mb-3 flex items-center justify-between font-mono text-[.68rem] uppercase tracking-[.13em] text-slate-500">
          <span data-testid="text-question-progress">Pergunta {questionIndex + 1} de 16</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-slate-800" aria-label={`Progresso: ${Math.round(progress)}%`}>
          <div className="h-full rounded-full bg-[hsl(var(--primary))] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <section className="mx-auto mt-12 max-w-3xl phar-appear-delay">
        <div className="mb-6 flex items-center gap-2 text-[hsl(var(--primary))]">
          <CircleHelp size={18} strokeWidth={1.5} />
          <span className="font-mono text-[.68rem] uppercase tracking-[.15em]">Responda com sinceridade</span>
        </div>
        <h1 className="phar-display max-w-2xl text-4xl font-semibold text-slate-100 sm:text-6xl" data-testid={`text-question-${question.id}`}>{question.prompt}</h1>
        <div className="mt-10">
          {question.kind === 'text' ? (
            <label className="block">
              <span className="sr-only">{question.prompt}</span>
              <textarea
                className="min-h-36 w-full resize-y rounded-2xl border border-slate-700 bg-slate-900/70 p-5 text-base text-slate-100 placeholder:text-slate-600 transition-colors focus:border-[hsl(var(--primary))] focus:bg-slate-900 focus:outline-none"
                value={answer}
                onChange={(event) => onAnswer(question.id, event.target.value)}
                placeholder={question.placeholder}
                data-testid={`input-answer-${question.id}`}
              />
              <span className="mt-3 block font-mono text-[.65rem] uppercase tracking-[.1em] text-slate-600">Sua resposta fica apenas nesta sessão</span>
            </label>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={question.prompt}>
              {question.options?.map((option, optionIndex) => {
                const selected = answer === option;
                return (
                  <button
                    className={`group flex min-h-[66px] items-center gap-4 rounded-xl border px-5 text-left transition-all ${selected ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.12)] text-slate-100 shadow-[0_0_0_1px_hsl(var(--primary)/.18)]' : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:bg-slate-800/70'}`}
                    key={option}
                    onClick={() => onAnswer(question.id, option)}
                    role="radio"
                    aria-checked={selected}
                    data-testid={`option-${question.id}-${optionIndex}`}
                  >
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${selected ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-slate-950' : 'border-slate-600 group-hover:border-slate-400'}`}>
                      {selected && <Check size={13} strokeWidth={3} />}
                    </span>
                    <span className="text-sm font-medium">{option}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <footer className="mx-auto mt-12 flex max-w-3xl items-center justify-between gap-3 border-t border-slate-800 pt-6">
        <button className="phar-button phar-button-ghost min-h-11 px-4 text-[.68rem]" onClick={onPrevious} disabled={questionIndex === 0} data-testid="button-previous">
          <ArrowLeft size={15} /> VOLTAR
        </button>
        <button className="phar-button phar-button-primary min-h-11 px-4 text-[.68rem] sm:px-6" onClick={onNext} disabled={!canContinue} data-testid={isLast ? 'button-view-diagnosis' : 'button-continue'}>
          {isLast ? 'VER MEU DIAGNÓSTICO' : 'CONTINUAR'} <ArrowRight size={15} />
        </button>
      </footer>
    </main>
  );
}