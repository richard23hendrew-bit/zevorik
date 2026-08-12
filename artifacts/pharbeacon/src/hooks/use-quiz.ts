import { useCallback, useState } from 'react';
import { questions, type Answers } from '@/data/questions';

export type QuizPhase = 'intro' | 'quiz' | 'loading' | 'result';

export function useQuiz() {
  const [phase, setPhase] = useState<QuizPhase>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const start = useCallback(() => {
    setQuestionIndex(0);
    setPhase('quiz');
  }, []);

  const setAnswer = useCallback((id: number, value: string) => {
    setAnswers((current) => ({ ...current, [id]: value }));
  }, []);

  const next = useCallback(() => {
    if (questionIndex < questions.length - 1) setQuestionIndex((index) => index + 1);
    else setPhase('loading');
  }, [questionIndex]);

  const previous = useCallback(() => {
    if (questionIndex > 0) setQuestionIndex((index) => index - 1);
  }, [questionIndex]);

  const reset = useCallback(() => {
    setAnswers({});
    setQuestionIndex(0);
    setPhase('intro');
  }, []);

  const showResult = useCallback(() => setPhase('result'), []);

  return { phase, questionIndex, answers, start, setAnswer, next, previous, reset, showResult };
}