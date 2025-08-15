import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { PersonalKPIs } from '@/components/agent/PersonalKPIs';
import { CARERadar } from '@/components/agent/CARERadar';
import { PerformanceEvolution } from '@/components/agent/PerformanceEvolution';
import { RecentAnalyses } from '@/components/agent/RecentAnalyses';
import { AudioUploader } from '@/components/sales/AudioUploader';
import { CAREAnalysisService } from '@/services/ai/careAnalysisService';
import { ConversationAnalysis, AgentPerformance } from '@/types/care';
import { Upload, BarChart3, Target, TrendingUp, LogOut } from 'lucide-react';

export default function AgentDashboard() {
  const { user, logout } = useAuth();
  const [performance, setPerformance] = useState<AgentPerformance | null>(null);
  const [analyses, setAnalyses] = useState<ConversationAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ConversationAnalysis | null>(null);

  useEffect(() => {
    if (user) {
      // Carrega dados mock de performance
      const mockPerformance = CAREAnalysisService.generateMockPerformanceData(user.id, user.name);
      setPerformance(mockPerformance);
      
      // Carrega análises mock do localStorage
      const savedAnalyses = localStorage.getItem(`analyses_${user.id}`);
      if (savedAnalyses) {
        setAnalyses(JSON.parse(savedAnalyses));
      }
    }
  }, [user]);

  const handleAnalysisComplete = (newAnalysis: ConversationAnalysis) => {
    const updatedAnalyses = [newAnalysis, ...analyses];
    setAnalyses(updatedAnalyses);
    
    // Salva no localStorage
    localStorage.setItem(`analyses_${user?.id}`, JSON.stringify(updatedAnalyses));
    
    // Recalcula performance
    if (user) {
      const updatedPerformance = {
        ...performance!,
        totalAnalyses: updatedAnalyses.length,
        // Aqui deveria recalcular as médias baseado nas análises reais
      };
      setPerformance(updatedPerformance);
    }
  };

  const handleViewAnalysis = (analysis: ConversationAnalysis) => {
    setSelectedAnalysis(analysis);
  };

  if (!user || !performance) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedAnalysis) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedAnalysis(null)}
                >
                  ← Voltar
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Análise Detalhada</h1>
                  <p className="text-muted-foreground">{selectedAnalysis.leadName}</p>
                </div>
              </div>
              <Badge variant="outline">
                Score: {selectedAnalysis.careScore.total.toFixed(1)}/5.0
              </Badge>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <CARERadar 
              careScore={selectedAnalysis.careScore} 
              title="Performance nesta Conversa"
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Insights e Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-success mb-2">✅ Pontos Positivos</h4>
                  <ul className="space-y-1">
                    {selectedAnalysis.insights.pontosPositivos.map((ponto, idx) => (
                      <li key={idx} className="text-sm">{ponto}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-warning mb-2">📈 Pontos a Melhorar</h4>
                  <ul className="space-y-1">
                    {selectedAnalysis.insights.pontosAMelhorar.map((ponto, idx) => (
                      <li key={idx} className="text-sm">{ponto}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-2">💡 Recomendações</h4>
                  <ul className="space-y-1">
                    {selectedAnalysis.insights.recomendacoes.map((rec, idx) => (
                      <li key={idx} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>

                {selectedAnalysis.insights.oportunidadesPerdidas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-destructive mb-2">⚠️ Oportunidades Perdidas</h4>
                    <ul className="space-y-1">
                      {selectedAnalysis.insights.oportunidadesPerdidas.map((op, idx) => (
                        <li key={idx} className="text-sm">{op}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Athena Agent</h1>
                  <p className="text-muted-foreground">Olá, {user.name}!</p>
                </div>
              </div>
              <Badge variant="outline">
                Vendedor
              </Badge>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Nova Análise</span>
            </TabsTrigger>
            <TabsTrigger value="evolution" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Evolução</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <PersonalKPIs performance={performance} />
            
            <div className="grid gap-6 lg:grid-cols-2">
              <CARERadar careScore={performance.averageCAREScore} />
              <RecentAnalyses 
                analyses={analyses} 
                onViewAnalysis={handleViewAnalysis}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <AudioUploader 
              onAnalysisComplete={handleAnalysisComplete}
              agentId={user.id}
            />
          </TabsContent>

          <TabsContent value="evolution">
            <PerformanceEvolution performance={performance} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}