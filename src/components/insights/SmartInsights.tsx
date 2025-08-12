import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb,
  RefreshCw,
  Target,
  Zap
} from 'lucide-react';
import { googleAI } from '@/services/ai/googleAI';
import { useToast } from '@/hooks/use-toast';

export interface Insight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  timestamp: Date;
  category: 'performance' | 'churn' | 'engagement' | 'system';
  actionable: boolean;
  metrics?: Record<string, number>;
}

interface SmartInsightsProps {
  dashboardData?: any;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function SmartInsights({ 
  dashboardData, 
  autoRefresh = true, 
  refreshInterval = 300000 // 5 minutos
}: SmartInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      // Dados simulados do dashboard para análise
      const mockDashboardData = dashboardData || {
        performance: {
          responseTime: 2.3,
          resolutionRate: 87,
          messagesProcessed: 15678,
          systemUptime: 99.9
        },
        churn: {
          highRiskUsers: 4,
          totalUsers: 1247,
          churnRate: 12.5,
          avgMessagesPerUser: 18.4
        },
        engagement: {
          dailyActiveUsers: 856,
          avgSessionDuration: 4.2,
          messagesSentToday: 2341,
          userSatisfaction: 4.2
        }
      };

      const analysisPrompt = `
        Analise os seguintes dados do dashboard e gere insights automáticos:
        
        Performance:
        - Tempo de resposta: ${mockDashboardData.performance.responseTime}s
        - Taxa de resolução: ${mockDashboardData.performance.resolutionRate}%
        - Mensagens processadas: ${mockDashboardData.performance.messagesProcessed}
        - Uptime: ${mockDashboardData.performance.systemUptime}%
        
        Churn:
        - Usuários alto risco: ${mockDashboardData.churn.highRiskUsers}
        - Total de usuários: ${mockDashboardData.churn.totalUsers}
        - Taxa de churn: ${mockDashboardData.churn.churnRate}%
        - Média msgs/usuário: ${mockDashboardData.churn.avgMessagesPerUser}
        
        Engajamento:
        - Usuários ativos diários: ${mockDashboardData.engagement.dailyActiveUsers}
        - Duração média sessão: ${mockDashboardData.engagement.avgSessionDuration}min
        - Mensagens hoje: ${mockDashboardData.engagement.messagesSentToday}
        - Satisfação: ${mockDashboardData.engagement.userSatisfaction}/5
        
        Gere exatamente 3 insights em formato JSON array com as seguintes propriedades:
        - type: "opportunity", "risk", "trend" ou "recommendation"
        - title: título conciso (máximo 50 caracteres)
        - description: descrição detalhada (máximo 120 caracteres)
        - impact: "high", "medium" ou "low"
        - confidence: número entre 70-95
        - category: "performance", "churn", "engagement" ou "system"
        - actionable: true/false
        
        Responda apenas com o JSON array, sem texto adicional.
      `;

      const response = await googleAI.generateResponse(analysisPrompt);
      
      // Tentar parsear a resposta como JSON
      let parsedInsights: any[] = [];
      try {
        parsedInsights = JSON.parse(response);
      } catch (parseError) {
        // Se falhar o parse, gerar insights padrão
        parsedInsights = generateFallbackInsights(mockDashboardData);
      }

      // Converter para formato de Insight
      const newInsights: Insight[] = parsedInsights.map((insight, index) => ({
        id: `insight-${Date.now()}-${index}`,
        type: insight.type || 'recommendation',
        title: insight.title || 'Insight gerado',
        description: insight.description || 'Análise automática do sistema',
        impact: insight.impact || 'medium',
        confidence: insight.confidence || 85,
        timestamp: new Date(),
        category: insight.category || 'system',
        actionable: insight.actionable || true,
        metrics: mockDashboardData
      }));

      setInsights(newInsights);
      setLastUpdate(new Date());

      // Mostrar toast para insights de alto impacto
      const highImpactInsights = newInsights.filter(i => i.impact === 'high');
      if (highImpactInsights.length > 0) {
        toast({
          title: "🧠 Novos Insights",
          description: `${highImpactInsights.length} insight${highImpactInsights.length > 1 ? 's' : ''} de alto impacto detectado${highImpactInsights.length > 1 ? 's' : ''}`,
        });
      }

    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar insights no momento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackInsights = (data: any): any[] => {
    return [
      {
        type: 'opportunity',
        title: 'Otimização de Performance',
        description: 'Tempo de resposta pode ser melhorado em 30% com ajustes no cache',
        impact: 'medium',
        confidence: 82,
        category: 'performance',
        actionable: true
      },
      {
        type: 'risk',
        title: 'Usuários em Risco Detectados',
        description: `${data.churn.highRiskUsers} usuários com alta probabilidade de churn identificados`,
        impact: 'high',
        confidence: 91,
        category: 'churn',
        actionable: true
      },
      {
        type: 'trend',
        title: 'Crescimento no Engajamento',
        description: 'Aumento de 15% na satisfação dos usuários nas últimas 2 semanas',
        impact: 'low',
        confidence: 78,
        category: 'engagement',
        actionable: false
      }
    ];
  };

  useEffect(() => {
    generateInsights();

    if (autoRefresh) {
      const interval = setInterval(generateInsights, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, dashboardData]);

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'trend':
        return <TrendingDown className="h-4 w-4 text-warning" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-info" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getImpactVariant = (impact: Insight['impact']) => {
    switch (impact) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getCategoryIcon = (category: Insight['category']) => {
    switch (category) {
      case 'performance':
        return <Zap className="h-3 w-3" />;
      case 'churn':
        return <Target className="h-3 w-3" />;
      case 'engagement':
        return <TrendingUp className="h-3 w-3" />;
      case 'system':
        return <Brain className="h-3 w-3" />;
      default:
        return <Brain className="h-3 w-3" />;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Smart Insights
            </CardTitle>
            <CardDescription>
              Insights automáticos gerados por IA • Última atualização: {formatTime(lastUpdate)}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analisando...' : 'Atualizar'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {insights.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Brain className="h-8 w-8 mb-2" />
              <p>Nenhum insight disponível</p>
            </div>
          ) : (
            <div className="space-y-1">
              {insights.map((insight, index) => (
                <div key={insight.id}>
                  <div className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center gap-2 mt-0.5">
                          {getInsightIcon(insight.type)}
                          {getCategoryIcon(insight.category)}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium">{insight.title}</h4>
                            <Badge variant={getImpactVariant(insight.impact)}>
                              {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'} impacto
                            </Badge>
                            {insight.actionable && (
                              <Badge variant="outline" className="text-primary">
                                <Target className="h-3 w-3 mr-1" />
                                Acionável
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {insight.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Brain className="h-3 w-3" />
                              {insight.confidence}% confiança
                            </span>
                            <span className="capitalize">{insight.category}</span>
                            <span className="capitalize">{insight.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      {insight.actionable && (
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Agir
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {index < insights.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}