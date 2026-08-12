import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { IntroView } from '@/components/intro-view';
import { QuizView } from '@/components/quiz-view';
import { LoadingView } from '@/components/loading-view';
import { ResultView } from '@/components/result-view';
import { useQuiz } from '@/hooks/use-quiz';
import { analyze } from '@/lib/analysis';
import { Router as WouterRouter, Route, Switch, useLocation } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Home() {
  const quiz = useQuiz();
  const [diagnosis, setDiagnosis] = useState(() => analyze({}));
  const { phase, answers, showResult } = quiz;

  useEffect(() => {
    if (phase !== 'loading') return;
    const timer = window.setTimeout(() => {
      setDiagnosis(analyze(answers));
      showResult();
    }, 2100);
    return () => window.clearTimeout(timer);
  }, [phase, answers, showResult]);

  if (quiz.phase === 'intro') return <IntroView onStart={quiz.start} />;
  if (quiz.phase === 'quiz') return <QuizView questionIndex={quiz.questionIndex} answers={quiz.answers} onAnswer={quiz.setAnswer} onNext={quiz.next} onPrevious={quiz.previous} />;
  if (quiz.phase === 'loading') return <LoadingView />;
  return <ResultView diagnosis={diagnosis} onReset={quiz.reset} />;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;