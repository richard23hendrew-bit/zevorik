import assert from 'node:assert/strict';
import type { Answers } from '../data/questions';
import { analyze } from './analysis';

const answers = (entries: Array<[number, string]>): Answers =>
  Object.fromEntries(entries) as Answers;

const categories = (result: ReturnType<typeof analyze>) =>
  result.priorities.map((priority) => priority.category);

const report = (name: string, result: ReturnType<typeof analyze>) => {
  console.log(`\n${name}`);
  result.priorities.forEach((priority, index) => {
    console.log(`${index + 1}. ${priority.category} — respostas: Q${priority.sourceIds?.join(', Q') ?? '—'}`);
  });
  console.log(`Pontos fortes: ${result.strengths.map((strength) => strength.category).join(', ') || 'nenhum sinal positivo explícito'}`);
  console.log(`Próximos passos: ${result.nextStep.category} — ${result.nextStep.steps.join(' | ')}`);
};

const scenarioOne = analyze(answers([
  [1, 'Cabelo'], [2, 'Menos de 1 ano'], [3, '2 a 5'], [4, 'Até R$10 mil'],
  [5, 'Às vezes'], [6, 'Tenho uma ideia'], [7, 'Muito maiores'], [8, 'Estáveis'],
  [9, 'Indicação'], [10, 'Talvez'], [11, 'Falta de cliente'], [12, 'Sim'],
  [13, 'Não sei dizer'], [14, 'Algumas'], [15, 'Todo mês'], [16, 'Custos'],
]));
assert.deepEqual(categories(scenarioOne), ['CLIENTES', 'CUSTOS', 'FINANCEIRO']);
assert.ok(scenarioOne.priorities[0].sourceIds?.includes(11));
assert.ok(scenarioOne.priorities[0].sourceIds?.includes(9));
assert.ok(scenarioOne.priorities[1].sourceIds?.includes(7));
assert.ok(scenarioOne.priorities[1].sourceIds?.includes(16));
assert.ok(scenarioOne.priorities[2].sourceIds?.includes(5));
assert.ok(scenarioOne.priorities[2].sourceIds?.includes(6));
report('CENÁRIO 1 — empresa em fase de estruturação', scenarioOne);

const healthy = analyze(answers([
  [5, 'Sim, e sobra'], [6, 'Sim'], [7, 'Menores'], [8, 'Crescendo'],
  [10, 'Sim'], [12, 'Não'], [14, 'Sim'], [15, 'Toda semana'],
]));
assert.ok(healthy.priorities.every((priority) => priority.level !== 'crítico'));
assert.ok(healthy.strengths.some((strength) => strength.category === 'FINANCEIRO'));
assert.ok(healthy.strengths.some((strength) => strength.category === 'VENDAS'));
report('CENÁRIO 2 — empresa saudável', healthy);

const financial = analyze(answers([
  [5, 'Não'], [6, 'Não'], [7, 'Muito maiores'], [8, 'Caindo'],
  [13, 'As despesas estão muito altas'], [14, 'Não'], [15, 'Nunca'],
  [16, 'Preciso controlar os custos'],
]));
assert.ok(categories(financial).includes('CUSTOS'));
assert.ok(categories(financial).includes('FINANCEIRO'));
assert.ok(categories(financial).includes('VENDAS') || categories(financial).includes('GESTÃO'));
assert.ok(financial.priorities[0].sourceIds?.includes(7));
assert.ok(financial.priorities[0].sourceIds?.includes(13));
report('CENÁRIO 3 — pressão financeira', financial);

const customers = analyze(answers([
  [8, 'Estáveis'], [9, 'Indicação'], [10, 'Talvez'],
  [11, 'Tenho poucos clientes'], [16, 'Preciso conseguir mais clientes'],
]));
assert.equal(categories(customers)[0], 'CLIENTES');
assert.ok(customers.priorities[0].sourceIds?.includes(9));
assert.ok(customers.priorities[0].sourceIds?.includes(11));
assert.ok(customers.priorities[0].sourceIds?.includes(16));
report('CENÁRIO 4 — problema de clientes', customers);

console.log('\nMOTOR VALIDADO');