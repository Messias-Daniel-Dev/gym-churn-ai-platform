import { CAREScore, ConversationAnalysis, CARECriteria } from '@/types/care';

// Critérios de avaliação C.A.R.E. para a Gobatti Gym
export const CARE_CRITERIA: CARECriteria = {
  conexao: {
    description: "Capacidade de criar rapport, ambiente confortável e compreender a situação inicial do lead",
    excellent: [
      "Cumprimento caloroso e personalizado",
      "Demonstra interesse genuíno na pessoa",
      "Faz perguntas abertas sobre bem-estar",
      "Escuta ativamente e demonstra empatia",
      "Cria ambiente descontraído"
    ],
    good: [
      "Cumprimento cordial",
      "Mostra interesse básico",
      "Faz algumas perguntas pessoais",
      "Escuta adequadamente"
    ],
    needsImprovement: [
      "Cumprimento formal demais",
      "Vai direto ao assunto sem rapport",
      "Não demonstra interesse pessoal",
      "Não escuta ativamente"
    ]
  },
  analise: {
    description: "Profundidade da investigação sobre dores, necessidades, frustrações e objetivos do lead",
    excellent: [
      "Identifica dores específicas e frustrações",
      "Descobre objetivos claros e motivações",
      "Explora histórico de atividade física",
      "Compreende limitações e preferências",
      "Identifica fatores de decisão"
    ],
    good: [
      "Faz perguntas sobre objetivos",
      "Explora algumas dores básicas",
      "Pergunta sobre experiência anterior",
      "Identifica algumas preferências"
    ],
    needsImprovement: [
      "Perguntas superficiais",
      "Não explora dores reais",
      "Assume necessidades sem investigar",
      "Não descobre motivações profundas"
    ]
  },
  resolucao: {
    description: "Habilidade de apresentar a Gobatti Gym como solução ideal para problemas identificados",
    excellent: [
      "Conecta benefícios às dores específicas",
      "Apresenta soluções personalizadas",
      "Usa histórias de sucesso relevantes",
      "Demonstra valor único da Gobatti",
      "Aborda objeções proativamente"
    ],
    good: [
      "Apresenta benefícios gerais",
      "Conecta algumas soluções às necessidades",
      "Menciona diferenciais da academia",
      "Responde objeções adequadamente"
    ],
    needsImprovement: [
      "Apresentação genérica",
      "Não conecta aos problemas do lead",
      "Foca apenas em preço e modalidades",
      "Não aborda objeções"
    ]
  },
  engajamento: {
    description: "Eficácia em conduzir o lead para um próximo passo claro e concreto",
    excellent: [
      "Propõe próximo passo específico",
      "Agenda ação concreta (aula experimental)",
      "Cria urgência apropriada",
      "Confirma compromisso do lead",
      "Define expectativas claras"
    ],
    good: [
      "Sugere próximos passos",
      "Tenta agendar atividade",
      "Cria alguma urgência",
      "Busca confirmação"
    ],
    needsImprovement: [
      "Não propõe próximos passos",
      "Deixa indefinido",
      "Não cria urgência",
      "Não confirma compromisso"
    ]
  }
};

export class CAREAnalysisService {
  // Mock data para desenvolvimento - será substituído por análise de IA real
  static async analyzeConversation(
    transcription: string, 
    agentId: string,
    leadName?: string
  ): Promise<ConversationAnalysis> {
    // Simula processamento por IA
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis baseado em palavras-chave
    const careScore = this.generateMockCAREScore(transcription);
    const insights = this.generateMockInsights(transcription, careScore);

    return {
      id: `analysis_${Date.now()}`,
      agentId,
      leadName: leadName || "Lead Anônimo",
      transcription,
      careScore,
      insights,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private static generateMockCAREScore(transcription: string): CAREScore {
    const text = transcription.toLowerCase();
    
    // Análise simplificada baseada em palavras-chave
    const conexaoScore = this.calculatePillarScore(text, [
      'olá', 'bom dia', 'boa tarde', 'prazer', 'como está', 'tudo bem',
      'nome', 'conhecer', 'conte', 'fale sobre'
    ]);
    
    const analiseScore = this.calculatePillarScore(text, [
      'objetivo', 'meta', 'problema', 'dificuldade', 'porque', 'motivação',
      'experiência', 'já praticou', 'prefere', 'gosta', 'tempo'
    ]);
    
    const resolucaoScore = this.calculatePillarScore(text, [
      'nossa academia', 'gobatti', 'oferecemos', 'temos', 'solução',
      'benefício', 'resultado', 'diferencial', 'qualidade'
    ]);
    
    const engajamentoScore = this.calculatePillarScore(text, [
      'aula experimental', 'visita', 'quando', 'agendar', 'próximo passo',
      'começar', 'iniciar', 'hoje', 'amanhã', 'semana'
    ]);

    const total = Number(((conexaoScore + analiseScore + resolucaoScore + engajamentoScore) / 4).toFixed(1));

    return {
      conexao: conexaoScore,
      analise: analiseScore,
      resolucao: resolucaoScore,
      engajamento: engajamentoScore,
      total
    };
  }

  private static calculatePillarScore(text: string, keywords: string[]): number {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    const percentage = Math.min(matches / keywords.length, 1);
    
    // Adiciona alguma variação aleatória para simular análise real
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 a 1.2
    let score = (percentage * 5 * randomFactor);
    
    // Garante que está entre 0 e 5
    score = Math.max(0, Math.min(5, score));
    
    return Number(score.toFixed(1));
  }

  private static generateMockInsights(transcription: string, careScore: CAREScore) {
    const insights = {
      pontosPositivos: [] as string[],
      pontosAMelhorar: [] as string[],
      recomendacoes: [] as string[],
      oportunidadesPerdidas: [] as string[],
      comparacoes: [] as { disse: string; poderiaDisser: string; }[]
    };

    // Análise baseada nos scores
    if (careScore.conexao >= 4) {
      insights.pontosPositivos.push("Excelente rapport inicial e conexão com o lead");
    } else if (careScore.conexao < 3) {
      insights.pontosAMelhorar.push("Melhorar a criação de rapport no início da conversa");
      insights.recomendacoes.push("Dedique mais tempo ao cumprimento e perguntas pessoais");
    }

    if (careScore.analise >= 4) {
      insights.pontosPositivos.push("Boa investigação das necessidades do lead");
    } else if (careScore.analise < 3) {
      insights.pontosAMelhorar.push("Aprofundar a investigação de dores e objetivos");
      insights.recomendacoes.push("Use perguntas abertas para explorar motivações profundas");
    }

    if (careScore.resolucao >= 4) {
      insights.pontosPositivos.push("Apresentação eficaz da solução Gobatti Gym");
    } else if (careScore.resolucao < 3) {
      insights.pontosAMelhorar.push("Conectar melhor os benefícios às necessidades do lead");
      insights.recomendacoes.push("Personalize a apresentação com base nas dores identificadas");
    }

    if (careScore.engajamento >= 4) {
      insights.pontosPositivos.push("Excelente condução para próximos passos");
    } else if (careScore.engajamento < 3) {
      insights.pontosAMelhorar.push("Melhorar o fechamento e agendamento de próximas ações");
      insights.recomendacoes.push("Sempre termine propondo uma ação concreta específica");
    }

    // Oportunidades perdidas baseadas em análise mock
    if (careScore.analise < 4) {
      insights.oportunidadesPerdidas.push("Poderia ter explorado mais o histórico de atividade física");
    }
    
    if (careScore.engajamento < 4) {
      insights.oportunidadesPerdidas.push("Oportunidade de agendar aula experimental perdida");
    }

    // Comparações mock
    insights.comparacoes.push({
      disse: "Nossa academia tem bons equipamentos",
      poderiaDisser: "Nossos equipamentos de última geração vão te ajudar a alcançar [objetivo específico mencionado]"
    });

    return insights;
  }

  // Gera dados mock de performance para desenvolvimento
  static generateMockPerformanceData(agentId: string, agentName: string) {
    const analyses = Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      score: 2.5 + Math.random() * 2 // Score entre 2.5 e 4.5
    }));

    const avgScore = analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length;

    return {
      agentId,
      agentName,
      totalAnalyses: analyses.length,
      averageCAREScore: {
        conexao: Number((avgScore + (Math.random() - 0.5)).toFixed(1)),
        analise: Number((avgScore + (Math.random() - 0.5)).toFixed(1)),
        resolucao: Number((avgScore + (Math.random() - 0.5)).toFixed(1)),
        engajamento: Number((avgScore + (Math.random() - 0.5)).toFixed(1)),
        total: Number(avgScore.toFixed(1))
      },
      evolution: analyses,
      strongestPillar: ['conexao', 'analise', 'resolucao', 'engajamento'][Math.floor(Math.random() * 4)] as keyof Omit<CAREScore, 'total'>,
      weakestPillar: ['conexao', 'analise', 'resolucao', 'engajamento'][Math.floor(Math.random() * 4)] as keyof Omit<CAREScore, 'total'>,
      rank: Math.floor(Math.random() * 5) + 1,
      trend: (['up', 'down', 'stable'][Math.floor(Math.random() * 3)]) as 'up' | 'down' | 'stable'
    };
  }
}