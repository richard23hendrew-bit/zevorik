import type { Answers } from '../data/questions';

export type SemanticLevel = 'destaque' | 'forte' | 'atenção' | 'alerta' | 'crítico';

export type Signal = {
  category: string;
  level: SemanticLevel;
  reason: string;
  declared?: boolean;
  /** Internal evidence trail used by development scenarios, never rendered as a score. */
  sourceIds?: number[];
};

export type Diagnosis = {
  overview: string;
  priorities: Signal[];
  strengths: Signal[];
  nextStep: { category: string; steps: string[] };
};

type Evidence = {
  category: string;
  level: SemanticLevel;
  reason: string;
  sourceId: number;
  declared?: boolean;
};

type Aggregate = {
  category: string;
  relevance: number;
  level: SemanticLevel;
  reasons: string[];
  sourceIds: Set<number>;
  declared: boolean;
};

const keywordGroups: Record<string, string[]> = {
  CLIENTES: ['cliente', 'publico', 'movimento', 'captacao'],
  VENDAS: ['venda', 'vender', 'faturamento', 'receita', 'pedido'],
  CUSTOS: ['custo', 'despesa', 'caro', 'gasto', 'conta', 'juros', 'divida', 'aluguel', 'imposto'],
  FINANCEIRO: ['dinheiro', 'caixa', 'lucro', 'margem', 'capital', 'inadimplencia'],
  EQUIPE: ['funcionario', 'equipe', 'colaborador', 'mao de obra'],
  OPERAÇÃO: ['desperdicio', 'retrabalho', 'processo', 'demora', 'lento', 'produtividade'],
  ESTOQUE: ['estoque', 'fornecedor', 'compra', 'logistica', 'entrega'],
  GESTÃO: ['controle', 'gestao', 'meta', 'planejamento', 'indicador', 'sistema', 'planilha'],
  MARKETING: ['marketing', 'divulgacao', 'anuncio', 'instagram', 'redes sociais', 'trafego'],
  ORGANIZAÇÃO: ['organizacao', 'organiza', 'desorganizacao', 'bagunca', 'rotina', 'prioridade'],
};

const recommendations: Record<string, string[]> = {
  CUSTOS: ['Liste seus três maiores custos.', 'Compare com o faturamento.', 'Identifique onde existe espaço para redução.'],
  CLIENTES: ['Liste a origem dos últimos 10 clientes.', 'Veja se depende muito de uma única fonte.', 'Trabalhe um segundo canal.'],
  VENDAS: ['Observe as vendas das últimas quatro semanas.', 'Identifique o que mudou.', 'Defina uma meta.'],
  FINANCEIRO: ['Liste entradas e saídas.', 'Separe custos fixos e variáveis.', 'Defina um valor mínimo de caixa.'],
  EFICIÊNCIA: ['Identifique a atividade que mais consome tempo.', 'Meça o tempo gasto.', 'Simplifique, delegue ou automatize.'],
  GESTÃO: ['Escolha três números importantes.', 'Defina uma meta.', 'Acompanhe semanalmente.'],
};

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const relevanceByLevel: Record<SemanticLevel, number> = {
  destaque: 0,
  forte: 0,
  atenção: 1,
  alerta: 2,
  crítico: 3,
};

const levelRank: Record<SemanticLevel, number> = {
  destaque: 0,
  forte: 1,
  atenção: 2,
  alerta: 3,
  crítico: 4,
};

const canonicalCategory = (category: string) => {
  if (category === 'FLUXO DE CAIXA' || category === 'CONTROLE FINANCEIRO') return 'FINANCEIRO';
  if (category === 'ORIGEM DE CLIENTES' || category === 'CAPACIDADE OCIOSA') return 'CLIENTES';
  if (category === 'METAS' || category === 'ACOMPANHAMENTO') return 'GESTÃO';
  return category;
};

const createSignal = (
  category: string,
  level: SemanticLevel,
  reason: string,
  sourceIds: number[] = [],
  declared = false,
): Signal => ({ category, level, reason, sourceIds, declared });

const makeObjectiveEvidence = (
  answers: Answers,
  id: number,
  value: string,
  level: SemanticLevel,
  category: string,
  reason: string,
): Evidence | null => answers[id] === value ? { category, level, reason, sourceId: id } : null;

export function analyze(answers: Answers): Diagnosis {
  const objective: Evidence[] = [];
  const add = (id: number, value: string, level: SemanticLevel, category: string, reason: string) => {
    const match = makeObjectiveEvidence(answers, id, value, level, category, reason);
    if (match) objective.push(match);
  };

  add(5, 'Sim, e sobra', 'destaque', 'FLUXO DE CAIXA', 'O dinheiro que entra paga as despesas e ainda deixa espaço.');
  add(5, 'Sim, mas sobra pouco', 'atenção', 'FLUXO DE CAIXA', 'As despesas estão cobertas, mas a folga no fim do mês é pequena.');
  add(5, 'Às vezes', 'alerta', 'FLUXO DE CAIXA', 'O caixa parece oscilar para cobrir todas as despesas.');
  add(5, 'Não', 'crítico', 'FLUXO DE CAIXA', 'As entradas não estão cobrindo todas as despesas com consistência.');
  add(6, 'Sim', 'destaque', 'CONTROLE FINANCEIRO', 'Você acompanha com clareza o que realmente sobra.');
  add(6, 'Tenho uma ideia', 'atenção', 'CONTROLE FINANCEIRO', 'Existe uma percepção, mas ainda falta uma visão precisa do resultado.');
  add(6, 'Não', 'alerta', 'CONTROLE FINANCEIRO', 'O resultado financeiro do mês ainda não está visível.');
  add(7, 'Muito maiores', 'alerta', 'CUSTOS', 'Os custos cresceram bastante nos últimos seis meses.');
  add(7, 'Um pouco maiores', 'atenção', 'CUSTOS', 'Os custos subiram e merecem acompanhamento próximo.');
  add(7, 'Praticamente iguais', 'forte', 'CUSTOS', 'Os custos parecem estáveis no período.');
  add(7, 'Menores', 'destaque', 'CUSTOS', 'Você conseguiu reduzir seus custos no período.');
  add(7, 'Não sei', 'atenção', 'CUSTOS', 'A evolução dos custos ainda não está clara.');
  add(8, 'Crescendo', 'destaque', 'VENDAS', 'As vendas estão em movimento de crescimento.');
  add(8, 'Estáveis', 'forte', 'VENDAS', 'As vendas mantêm um ritmo estável.');
  add(8, 'Caindo', 'crítico', 'VENDAS', 'As vendas estão caindo e pedem uma resposta rápida.');
  add(8, 'Não sei', 'atenção', 'VENDAS', 'O momento das vendas ainda não está claro.');
  add(9, 'Indicação', 'atenção', 'ORIGEM DE CLIENTES', 'A indicação é uma fonte importante de clientes.');
  add(9, 'Prospecção ativa', 'forte', 'ORIGEM DE CLIENTES', 'A prospecção ativa cria um canal que você consegue movimentar.');
  add(10, 'Sim', 'atenção', 'CAPACIDADE OCIOSA', 'Há espaço para vender mais com a estrutura que já existe.');
  add(10, 'Talvez', 'atenção', 'CAPACIDADE OCIOSA', 'Pode existir espaço para aproveitar melhor a estrutura atual.');
  add(10, 'Não sei', 'atenção', 'CAPACIDADE OCIOSA', 'Vale entender melhor o quanto a estrutura atual pode entregar.');
  add(12, 'Sim', 'alerta', 'EFICIÊNCIA', 'Uma atividade está consumindo mais recursos do que deveria.');
  add(12, 'Não', 'forte', 'EFICIÊNCIA', 'Você não identificou um gargalo relevante de eficiência.');
  add(12, 'Não sei', 'atenção', 'EFICIÊNCIA', 'Há uma oportunidade de observar melhor onde o tempo se concentra.');
  add(14, 'Sim', 'destaque', 'METAS', 'Existem metas claras para orientar as decisões.');
  add(14, 'Algumas', 'atenção', 'METAS', 'Algumas metas existem, mas ainda podem ganhar mais clareza.');
  add(14, 'Não', 'alerta', 'METAS', 'Falta um norte objetivo para guiar os próximos movimentos.');
  add(15, 'Todos os dias', 'destaque', 'ACOMPANHAMENTO', 'Os números fazem parte da sua rotina de decisão.');
  add(15, 'Toda semana', 'destaque', 'ACOMPANHAMENTO', 'Você acompanha os números com uma frequência saudável.');
  add(15, 'Todo mês', 'atenção', 'ACOMPANHAMENTO', 'O acompanhamento mensal oferece visão, mas pode chegar tarde.');
  add(15, 'Raramente', 'alerta', 'ACOMPANHAMENTO', 'Os números ainda aparecem pouco nas decisões do dia a dia.');
  add(15, 'Nunca', 'crítico', 'ACOMPANHAMENTO', 'A empresa está navegando sem acompanhar seus principais sinais.');

  const declared: Evidence[] = [];
  [11, 13, 16].forEach((sourceId) => {
    const text = normalize(answers[sourceId] ?? '');
    Object.entries(keywordGroups).forEach(([category, terms]) => {
      if (terms.some((term) => text.includes(term))) {
        declared.push({
          category,
          level: 'alerta',
          reason: `Você mencionou ${category.toLowerCase()} como um ponto que pesa hoje.`,
          sourceId,
          declared: true,
        });
      }
    });
  });

  const aggregates = new Map<string, Aggregate>();
  const addEvidence = (evidence: Evidence, extraRelevance = 0) => {
    const category = canonicalCategory(evidence.category);
    const current = aggregates.get(category) ?? {
      category,
      relevance: 0,
      level: 'atenção',
      reasons: [],
      sourceIds: new Set<number>(),
      declared: false,
    };
    current.relevance += relevanceByLevel[evidence.level] + extraRelevance;
    current.level = levelRank[evidence.level] > levelRank[current.level] ? evidence.level : current.level;
    if (!current.reasons.includes(evidence.reason)) current.reasons.push(evidence.reason);
    current.sourceIds.add(evidence.sourceId);
    current.declared ||= Boolean(evidence.declared);
    aggregates.set(category, current);
  };

  objective.forEach((evidence) => {
    if (relevanceByLevel[evidence.level] > 0) addEvidence(evidence);
  });
  declared.forEach((evidence) => addEvidence(evidence));

  const hasDeclared = (category: string) =>
    declared.some((evidence) => canonicalCategory(evidence.category) === category);

  // These bonuses express convergence between independent answers without
  // exposing an internal score to the user.
  if (hasDeclared('CLIENTES') && answers[9] === 'Indicação') {
    addEvidence({ category: 'CLIENTES', level: 'alerta', reason: 'A dependência de indicação reforça a necessidade de ampliar a origem dos clientes.', sourceId: 9 }, 2);
  }
  if (hasDeclared('CLIENTES') && ['Sim', 'Talvez'].includes(answers[10] ?? '')) {
    addEvidence({ category: 'CLIENTES', level: 'alerta', reason: 'Há uma oportunidade de aproveitar melhor a estrutura que já existe.', sourceId: 10 }, 1);
  }
  if (hasDeclared('CLIENTES') && answers[9] === 'Indicação' && answers[10] === 'Talvez') {
    addEvidence({ category: 'CLIENTES', level: 'alerta', reason: 'Os sinais de aquisição e capacidade estão apontando para a mesma frente.', sourceId: 10 }, 2);
  }
  if (hasDeclared('CUSTOS') && answers[7] === 'Muito maiores') {
    addEvidence({ category: 'CUSTOS', level: 'alerta', reason: 'O aumento dos custos também foi confirmado nas respostas abertas.', sourceId: 7 }, 3);
  }
  if (answers[5] === 'Às vezes' && answers[6] === 'Tenho uma ideia') {
    addEvidence({ category: 'FINANCEIRO', level: 'alerta', reason: 'O caixa oscila e o valor que sobra ainda não está totalmente claro.', sourceId: 6 }, 2);
  }
  if (answers[5] === 'Não' && answers[6] === 'Não') {
    addEvidence({ category: 'FINANCEIRO', level: 'crítico', reason: 'As despesas não estão cobertas e o resultado financeiro ainda não está visível.', sourceId: 6 }, 2);
  }

  const sortedAggregates = [...aggregates.values()].sort((a, b) => {
    if (b.relevance !== a.relevance) return b.relevance - a.relevance;
    return levelRank[b.level] - levelRank[a.level];
  });
  const selected = sortedAggregates.slice(0, 3).map((aggregate) => createSignal(
    aggregate.category,
    aggregate.level,
    aggregate.reasons.slice(0, 2).join(' '),
    [...aggregate.sourceIds].sort((a, b) => a - b),
    aggregate.declared,
  ));

  const strengthAggregates = new Map<string, Signal>();
  objective
    .filter((evidence) => evidence.level === 'destaque' || evidence.level === 'forte')
    .forEach((evidence) => {
      const category = canonicalCategory(evidence.category);
      const current = strengthAggregates.get(category);
      if (!current) {
        strengthAggregates.set(category, createSignal(category, evidence.level, evidence.reason, [evidence.sourceId]));
        return;
      }
      current.sourceIds = [...new Set([...(current.sourceIds ?? []), evidence.sourceId])].sort((a, b) => a - b);
      if (!current.reason.includes(evidence.reason)) current.reason += ` ${evidence.reason}`;
      if (levelRank[evidence.level] > levelRank[current.level]) current.level = evidence.level;
    });
  const strengths = [...strengthAggregates.values()].slice(0, 3);

  const primary = selected[0] ?? createSignal('VISÃO GERAL', 'forte', 'Suas respostas formam um ponto de partida claro para o próximo ciclo.');
  const category = recommendations[primary.category] ? primary.category : 'GESTÃO';

  return {
    overview: selected.length
      ? `As respostas apontam ${selected.length === 1 ? 'um foco principal' : `${selected.length} frentes que merecem atenção`}. Comece pelo sinal mais próximo da rotina e avance com uma ação por vez.`
      : 'Você criou uma boa base para olhar a empresa com mais clareza. O próximo passo é transformar essa leitura em uma pequena decisão.',
    priorities: selected,
    strengths: strengths.length ? strengths : [createSignal('BASE', 'forte', 'Você deu respostas diretas — isso já cria uma base melhor para decidir.')],
    nextStep: { category, steps: recommendations[category] ?? recommendations.GESTÃO },
  };
}