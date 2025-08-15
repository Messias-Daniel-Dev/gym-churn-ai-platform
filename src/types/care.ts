export interface CAREScore {
  conexao: number;      // 0-5 pontos - Capacidade de criar rapport e conexão
  analise: number;      // 0-5 pontos - Profundidade da investigação de necessidades
  resolucao: number;    // 0-5 pontos - Apresentação da solução de forma personalizada
  engajamento: number;  // 0-5 pontos - Condução para próximo passo concreto
  total: number;        // Média dos 4 pilares
}

export interface ConversationAnalysis {
  id: string;
  agentId: string;
  leadName?: string;
  audioFile?: File;
  transcription?: string;
  careScore: CAREScore;
  insights: {
    pontosPositivos: string[];
    pontosAMelhorar: string[];
    recomendacoes: string[];
    oportunidadesPerdidas: string[];
    comparacoes: {
      disse: string;
      poderiaDisser: string;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  totalAnalyses: number;
  averageCAREScore: CAREScore;
  evolution: {
    date: string;
    score: number;
  }[];
  strongestPillar: keyof Omit<CAREScore, 'total'>;
  weakestPillar: keyof Omit<CAREScore, 'total'>;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CARECriteria {
  conexao: {
    description: string;
    excellent: string[];
    good: string[];
    needsImprovement: string[];
  };
  analise: {
    description: string;
    excellent: string[];
    good: string[];
    needsImprovement: string[];
  };
  resolucao: {
    description: string;
    excellent: string[];
    good: string[];
    needsImprovement: string[];
  };
  engajamento: {
    description: string;
    excellent: string[];
    good: string[];
    needsImprovement: string[];
  };
}