import type { Answers } from '@/data/questions';

export type SemanticLevel = 'destaque' | 'forte' | 'atenção' | 'alerta' | 'crítico';

export type Signal = {
  category: string;
  level: SemanticLevel;
  reason: string;
  declared?: boolean;
};

export type Diagnosis = {
  overview: string;
  priorities: Signal[];
  strengths: Signal[];
  nextStep: { category: string; steps: string[] };
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

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const signal = (category: string, level: SemanticLevel, reason: string, declared = false): Signal => ({ category, level, reason, declared });

export function analyze(answers: Answers): Diagnosis {
  const objective: Signal[] = [];
  const add = (id: number, value: string, match: string, level: SemanticLevel, category: string, reason: string) => {
    if (answers[id] === value) objective.push(signal(category, level, reason));
  };
  add(5, 'Sim, e sobra', '', 'destaque', 'FLUXO DE CAIXA', 'O dinheiro que entra paga as despesas e ainda deixa espaço.');
  add(5, 'Sim, mas sobra pouco', '', 'atenção', 'FLUXO DE CAIXA', 'As despesas estão cobertas, mas a folga no fim do mês é pequena.');
  add(5, 'Às vezes', '', 'alerta', 'FLUXO DE CAIXA', 'O caixa parece oscilar para cobrir todas as despesas.');
  add(5, 'Não', '', 'crítico', 'FLUXO DE CAIXA', 'As entradas não estão cobrindo todas as despesas com consistência.');
  add(6, 'Sim', '', 'destaque', 'CONTROLE FINANCEIRO', 'Você acompanha com clareza o que realmente sobra.');
  add(6, 'Tenho uma ideia', '', 'atenção', 'CONTROLE FINANCEIRO', 'Existe uma percepção, mas ainda falta uma visão precisa do resultado.');
  add(6, 'Não', '', 'alerta', 'CONTROLE FINANCEIRO', 'O resultado financeiro do mês ainda não está visível.');
  add(7, 'Muito maiores', '', 'alerta', 'CUSTOS', 'Os custos cresceram bastante nos últimos seis meses.');
  add(7, 'Um pouco maiores', '', 'atenção', 'CUSTOS', 'Os custos subiram e merecem acompanhamento próximo.');
  add(7, 'Praticamente iguais', '', 'forte', 'CUSTOS', 'Os custos parecem estáveis no período.');
  add(7, 'Menores', '', 'destaque', 'CUSTOS', 'Você conseguiu reduzir seus custos no período.');
  add(7, 'Não sei', '', 'atenção', 'CUSTOS', 'A evolução dos custos ainda não está clara.');
  add(8, 'Crescendo', '', 'destaque', 'VENDAS', 'As vendas estão em movimento de crescimento.');
  add(8, 'Estáveis', '', 'forte', 'VENDAS', 'As vendas mantêm um ritmo estável.');
  add(8, 'Caindo', '', 'crítico', 'VENDAS', 'As vendas estão caindo e pedem uma resposta rápida.');
  add(8, 'Não sei', '', 'atenção', 'VENDAS', 'O momento das vendas ainda não está claro.');
  add(9, 'Indicação', '', 'atenção', 'ORIGEM DE CLIENTES', 'A indicação é uma fonte importante de clientes.');
  add(9, 'Prospecção ativa', '', 'forte', 'ORIGEM DE CLIENTES', 'A prospecção ativa cria um canal que você consegue movimentar.');
  add(10, 'Sim', '', 'atenção', 'CAPACIDADE OCIOSA', 'Há espaço para vender mais com a estrutura que já existe.');
  add(10, 'Talvez', '', 'atenção', 'CAPACIDADE OCIOSA', 'Pode existir espaço para aproveitar melhor a estrutura atual.');
  add(10, 'Não sei', '', 'atenção', 'CAPACIDADE OCIOSA', 'Vale entender melhor o quanto a estrutura atual pode entregar.');
  add(12, 'Sim', '', 'alerta', 'EFICIÊNCIA', 'Uma atividade está consumindo mais recursos do que deveria.');
  add(12, 'Não', '', 'forte', 'EFICIÊNCIA', 'Você não identificou um gargalo relevante de eficiência.');
  add(12, 'Não sei', '', 'atenção', 'EFICIÊNCIA', 'Há uma oportunidade de observar melhor onde o tempo se concentra.');
  add(14, 'Sim', '', 'destaque', 'METAS', 'Existem metas claras para orientar as decisões.');
  add(14, 'Algumas', '', 'atenção', 'METAS', 'Algumas metas existem, mas ainda podem ganhar mais clareza.');
  add(14, 'Não', '', 'alerta', 'METAS', 'Falta um norte objetivo para guiar os próximos movimentos.');
  add(15, 'Todos os dias', '', 'destaque', 'ACOMPANHAMENTO', 'Os números fazem parte da sua rotina de decisão.');
  add(15, 'Toda semana', '', 'destaque', 'ACOMPANHAMENTO', 'Você acompanha os números com uma frequência saudável.');
  add(15, 'Todo mês', '', 'atenção', 'ACOMPANHAMENTO', 'O acompanhamento mensal oferece visão, mas pode chegar tarde.');
  add(15, 'Raramente', '', 'alerta', 'ACOMPANHAMENTO', 'Os números ainda aparecem pouco nas decisões do dia a dia.');
  add(15, 'Nunca', '', 'crítico', 'ACOMPANHAMENTO', 'A empresa está navegando sem acompanhar seus principais sinais.');

  const declared: Signal[] = [];
  [11, 13, 16].forEach((id) => {
    const text = normalize(answers[id] ?? '');
    Object.entries(keywordGroups).forEach(([category, terms]) => {
      if (terms.some((term) => text.includes(term)) && !declared.some((item) => item.category === category)) {
        declared.push(signal(category, 'alerta', `Você mencionou ${category.toLowerCase()} como um ponto que pesa hoje.`, true));
      }
    });
  });

  const all = [...declared, ...objective];
  const unique = all.filter((item, index, list) => list.findIndex((other) => other.category === item.category) === index);
  const priorities = unique.filter((item) => item.level !== 'destaque' && item.level !== 'forte').slice(0, 3);
  const fallback = unique.slice(0, 3);
  const selected = priorities.length ? priorities : fallback;
  const strengths = objective.filter((item) => item.level === 'destaque' || item.level === 'forte').slice(0, 3);
  const primary = selected[0] ?? signal('VISÃO GERAL', 'forte', 'Suas respostas formam um ponto de partida claro para o próximo ciclo.');
  const category = recommendations[primary.category] ? primary.category : primary.category === 'FLUXO DE CAIXA' || primary.category === 'CONTROLE FINANCEIRO' ? 'FINANCEIRO' : primary.category === 'CAPACIDADE OCIOSA' || primary.category === 'ORIGEM DE CLIENTES' ? 'CLIENTES' : primary.category === 'METAS' || primary.category === 'ACOMPANHAMENTO' ? 'GESTÃO' : 'GESTÃO';

  return {
    overview: selected.length ? `As respostas apontam ${selected.length === 1 ? 'um foco principal' : `${selected.length} frentes que merecem atenção`}. Comece pelo sinal mais próximo da rotina e avance com uma ação por vez.` : 'Você criou uma boa base para olhar a empresa com mais clareza. O próximo passo é transformar essa leitura em uma pequena decisão.',
    priorities: selected,
    strengths: strengths.length ? strengths : [signal('BASE', 'forte', 'Você deu respostas diretas — isso já cria uma base melhor para decidir.')],
    nextStep: { category, steps: recommendations[category] ?? recommendations.GESTÃO },
  };
}