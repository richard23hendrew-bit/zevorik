export type QuestionKind = 'text' | 'choice';

export type Question = {
  id: number;
  prompt: string;
  kind: QuestionKind;
  options?: string[];
  placeholder?: string;
};

export type Answers = Record<number, string>;

export const questions: Question[] = [
  { id: 1, prompt: 'Qual é o principal produto ou serviço da sua empresa?', kind: 'text', placeholder: 'Escreva em poucas palavras' },
  { id: 2, prompt: 'Há quanto tempo sua empresa existe?', kind: 'choice', options: ['Menos de 1 ano', '1 a 3 anos', '3 a 5 anos', 'Mais de 5 anos'] },
  { id: 3, prompt: 'Quantas pessoas trabalham na empresa?', kind: 'choice', options: ['Apenas eu', '2 a 5', '6 a 10', '11 a 20', 'Mais de 20'] },
  { id: 4, prompt: 'Qual é aproximadamente o faturamento mensal?', kind: 'choice', options: ['Até R$10 mil', 'R$10 mil a R$30 mil', 'R$30 mil a R$50 mil', 'R$50 mil a R$100 mil', 'Acima de R$100 mil', 'Prefiro não informar'] },
  { id: 5, prompt: 'O dinheiro que entra normalmente é suficiente para pagar todas as despesas?', kind: 'choice', options: ['Sim, e sobra', 'Sim, mas sobra pouco', 'Às vezes', 'Não'] },
  { id: 6, prompt: 'Você sabe quanto realmente sobra para a empresa no final do mês?', kind: 'choice', options: ['Sim', 'Tenho uma ideia', 'Não'] },
  { id: 7, prompt: 'Comparando com 6 meses atrás, seus custos estão:', kind: 'choice', options: ['Muito maiores', 'Um pouco maiores', 'Praticamente iguais', 'Menores', 'Não sei'] },
  { id: 8, prompt: 'Como estão suas vendas atualmente?', kind: 'choice', options: ['Crescendo', 'Estáveis', 'Caindo', 'Não sei'] },
  { id: 9, prompt: 'De onde vêm principalmente seus clientes?', kind: 'choice', options: ['Indicação', 'Instagram / Redes sociais', 'Google / Internet', 'Loja física', 'Prospecção ativa', 'Outros'] },
  { id: 10, prompt: 'Você acredita que poderia vender mais usando a estrutura que já possui?', kind: 'choice', options: ['Sim', 'Talvez', 'Não', 'Não sei'] },
  { id: 11, prompt: 'Qual é hoje o maior problema da sua empresa?', kind: 'text', placeholder: 'Conte o que mais pesa hoje' },
  { id: 12, prompt: 'Existe alguma atividade que consome muito tempo ou dinheiro e poderia ser feita de forma mais eficiente?', kind: 'choice', options: ['Sim', 'Não', 'Não sei'] },
  { id: 13, prompt: 'Onde você acredita que sua empresa mais perde dinheiro atualmente?', kind: 'text', placeholder: 'Pode ser direto — não existe resposta certa' },
  { id: 14, prompt: 'Sua empresa possui metas claras?', kind: 'choice', options: ['Sim', 'Algumas', 'Não'] },
  { id: 15, prompt: 'Com que frequência você acompanha os principais números da empresa?', kind: 'choice', options: ['Todos os dias', 'Toda semana', 'Todo mês', 'Raramente', 'Nunca'] },
  { id: 16, prompt: 'Se você pudesse resolver APENAS UM problema da sua empresa hoje, qual seria?', kind: 'text', placeholder: 'Qual mudança faria mais diferença?' },
];