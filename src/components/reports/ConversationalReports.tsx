import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Volume2, 
  Download, 
  Calendar, 
  TrendingUp,
  Users,
  MessageSquare,
  BarChart3,
  Play,
  Pause,
  VolumeX
} from 'lucide-react';
import { googleAI } from '@/services/ai/googleAI';
import { openAIVoice } from '@/services/ai/openAI';
import { useToast } from '@/hooks/use-toast';

export interface ConversationalReport {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  category: 'performance' | 'churn' | 'engagement' | 'overview';
  generatedAt: Date;
  data: Record<string, any>;
  summary: string;
  insights: string[];
  audioUrl?: string;
  isGeneratingAudio?: boolean;
}

const mockReports: ConversationalReport[] = [
  {
    id: 'report-1',
    title: 'Relatório Diário de Performance',
    description: 'Análise completa do desempenho do sistema nas últimas 24h',
    type: 'daily',
    category: 'performance',
    generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
    data: {
      responseTime: 2.1,
      resolutionRate: 89,
      messagesProcessed: 3456,
      systemUptime: 99.8,
      peakHour: '14:00',
      userSatisfaction: 4.3
    },
    summary: 'O sistema apresentou excelente performance hoje, com tempo de resposta 15% melhor que ontem. Taxa de resolução subiu para 89%, indicando melhoria na qualidade das respostas.',
    insights: [
      'Pico de atividade às 14:00 com 456 mensagens/hora',
      'Satisfação do usuário aumentou 0.2 pontos',
      'Zero incidentes de sistema registrados'
    ]
  },
  {
    id: 'report-2',
    title: 'Análise Semanal de Churn',
    description: 'Avaliação de risco de perda de usuários e estratégias de retenção',
    type: 'weekly',
    category: 'churn',
    generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
    data: {
      churnRate: 11.2,
      highRiskUsers: 23,
      retentionActions: 18,
      successfulRetentions: 14,
      avgDaysToChurn: 12.5
    },
    summary: 'Taxa de churn semanal de 11.2%, abaixo da meta de 15%. Ações de retenção tiveram 78% de sucesso. Identificados padrões de comportamento que precedem o churn.',
    insights: [
      'Usuários com menos de 5 mensagens têm 3x mais risco',
      'Intervenções nas primeiras 48h são 65% mais eficazes',
      'Segmento "novos usuários" requer atenção especial'
    ]
  },
  {
    id: 'report-3',
    title: 'Resumo Mensal de Engajamento',
    description: 'Métricas de engajamento e satisfação dos usuários',
    type: 'monthly',
    category: 'engagement',
    generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    data: {
      dailyActiveUsers: 1247,
      avgSessionDuration: 6.8,
      messagesPerUser: 18.4,
      featureUsage: {
        voiceMessages: 34,
        fileSharing: 67,
        quickReplies: 89
      }
    },
    summary: 'Engajamento em alta com 1247 usuários ativos diários. Duração média das sessões cresceu 23% comparado ao mês anterior. Funcionalidades de voz ganharam popularidade.',
    insights: [
      'Mensagens de voz cresceram 340% no mês',
      'Usuários que usam voz têm 2x mais engajamento',
      'Quick replies são a funcionalidade mais popular'
    ]
  }
];

export function ConversationalReports() {
  const [reports, setReports] = useState<ConversationalReport[]>(mockReports);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const generateAudioExplanation = async (report: ConversationalReport) => {
    try {
      // Atualizar estado para mostrar loading
      setReports(prev => prev.map(r => 
        r.id === report.id 
          ? { ...r, isGeneratingAudio: true }
          : r
      ));

      // Gerar explicação em texto usando Gemini
      const explanationPrompt = `
        Você é um analista de dados especializado. Crie uma explicação em áudio (texto para TTS) sobre este relatório:
        
        Título: ${report.title}
        Resumo: ${report.summary}
        
        Dados principais: ${JSON.stringify(report.data)}
        
        Insights: ${report.insights.join(', ')}
        
        Crie uma explicação de 60-90 segundos que seja:
        - Clara e objetiva
        - Em tom profissional mas acessível
        - Destaque os pontos mais importantes
        - Inclua recomendações práticas
        - Use linguagem natural para áudio
        
        Responda apenas com o texto para ser convertido em áudio.
      `;

      const explanation = await googleAI.generateResponse(explanationPrompt);
      
      // Converter texto em áudio usando OpenAI
      const audioUrl = await openAIVoice.textToSpeech(explanation, 'nova');
      
      // Atualizar o relatório com o áudio
      setReports(prev => prev.map(r => 
        r.id === report.id 
          ? { ...r, audioUrl, isGeneratingAudio: false }
          : r
      ));

      toast({
        title: "🎵 Áudio gerado",
        description: "Explicação em áudio criada com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao gerar áudio:', error);
      
      setReports(prev => prev.map(r => 
        r.id === report.id 
          ? { ...r, isGeneratingAudio: false }
          : r
      ));

      toast({
        title: "Erro",
        description: "Não foi possível gerar o áudio da explicação.",
        variant: "destructive",
      });
    }
  };

  const playAudioExplanation = async (report: ConversationalReport) => {
    if (!report.audioUrl) return;

    try {
      // Parar áudio atual se estiver tocando
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = new Audio(report.audioUrl);
      setCurrentAudio(audio);
      setPlayingAudio(report.id);

      audio.onended = () => {
        setPlayingAudio(null);
        setCurrentAudio(null);
      };

      audio.onerror = () => {
        setPlayingAudio(null);
        setCurrentAudio(null);
        toast({
          title: "Erro",
          description: "Não foi possível reproduzir o áudio.",
          variant: "destructive",
        });
      };

      await audio.play();

    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      setPlayingAudio(null);
      setCurrentAudio(null);
      toast({
        title: "Erro",
        description: "Não foi possível reproduzir o áudio.",
        variant: "destructive",
      });
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setPlayingAudio(null);
      setCurrentAudio(null);
    }
  };

  const generateNewReport = () => {
    const reportTypes = ['daily', 'weekly', 'monthly'];
    const categories = ['performance', 'churn', 'engagement'];
    
    const newReport: ConversationalReport = {
      id: `report-${Date.now()}`,
      title: `Relatório ${reportTypes[Math.floor(Math.random() * reportTypes.length)]} de ${categories[Math.floor(Math.random() * categories.length)]}`,
      description: 'Relatório gerado automaticamente com base nos dados atuais',
      type: reportTypes[Math.floor(Math.random() * reportTypes.length)] as any,
      category: categories[Math.floor(Math.random() * categories.length)] as any,
      generatedAt: new Date(),
      data: {
        metric1: Math.floor(Math.random() * 100),
        metric2: Math.floor(Math.random() * 1000),
        metric3: Math.floor(Math.random() * 50)
      },
      summary: 'Novo relatório gerado com métricas atualizadas do sistema.',
      insights: [
        'Insight automático gerado pela IA',
        'Análise de tendências identificada',
        'Recomendação baseada em dados'
      ]
    };

    setReports([newReport, ...reports]);
    toast({
      title: "📊 Novo relatório gerado",
      description: "Relatório criado com sucesso! Você pode gerar o áudio da explicação.",
    });
  };

  const getReportIcon = (category: ConversationalReport['category']) => {
    switch (category) {
      case 'performance':
        return <BarChart3 className="h-4 w-4" />;
      case 'churn':
        return <Users className="h-4 w-4" />;
      case 'engagement':
        return <MessageSquare className="h-4 w-4" />;
      case 'overview':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeVariant = (type: ConversationalReport['type']) => {
    switch (type) {
      case 'daily':
        return 'default';
      case 'weekly':
        return 'secondary';
      case 'monthly':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    return `${diffDays} dias atrás`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Relatórios Conversacionais
            </CardTitle>
            <CardDescription>
              Relatórios inteligentes com explicações em áudio
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => generateNewReport()}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Gerar Novo
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 p-4">
            {reports.map((report) => (
              <Card key={report.id} className="border border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getReportIcon(report.category)}
                      <div>
                        <h4 className="font-medium text-foreground">{report.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getTypeVariant(report.type)}>
                            {report.type === 'daily' ? 'Diário' : 
                             report.type === 'weekly' ? 'Semanal' : 
                             report.type === 'monthly' ? 'Mensal' : 'Personalizado'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(report.generatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {report.audioUrl ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playingAudio === report.id ? stopAudio() : playAudioExplanation(report)}
                          disabled={report.isGeneratingAudio}
                        >
                          {playingAudio === report.id ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Parar
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Ouvir
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateAudioExplanation(report)}
                          disabled={report.isGeneratingAudio}
                        >
                          {report.isGeneratingAudio ? (
                            <>
                              <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                              Gerando...
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-4 w-4 mr-2" />
                              Gerar Áudio
                            </>
                          )}
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Resumo</h5>
                      <p className="text-sm text-muted-foreground">{report.summary}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-2">Principais Insights</h5>
                      <ul className="space-y-1">
                        {report.insights.map((insight, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}