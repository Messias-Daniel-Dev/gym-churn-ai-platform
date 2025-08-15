import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConversationAnalysis } from '@/types/care';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Play, Eye, FileText } from 'lucide-react';

interface RecentAnalysesProps {
  analyses: ConversationAnalysis[];
  onViewAnalysis: (analysis: ConversationAnalysis) => void;
}

export function RecentAnalyses({ analyses, onViewAnalysis }: RecentAnalysesProps) {
  const getScoreBadge = (score: number) => {
    if (score >= 4) return { variant: 'default' as const, label: 'Excelente' };
    if (score >= 3) return { variant: 'secondary' as const, label: 'Bom' };
    return { variant: 'destructive' as const, label: 'Melhorar' };
  };

  if (analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análises Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Nenhuma análise ainda</h3>
            <p className="text-muted-foreground">
              Faça o upload de sua primeira conversa para começar!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análises Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyses.slice(0, 5).map((analysis) => {
            const scoreBadge = getScoreBadge(analysis.careScore.total);
            
            return (
              <div key={analysis.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{analysis.leadName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(analysis.createdAt, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={scoreBadge.variant}>
                      {analysis.careScore.total.toFixed(1)}/5.0
                    </Badge>
                    <Badge variant="outline">
                      {scoreBadge.label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-muted-foreground">Conexão</div>
                    <div className="font-medium">{analysis.careScore.conexao.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Análise</div>
                    <div className="font-medium">{analysis.careScore.analise.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Resolução</div>
                    <div className="font-medium">{analysis.careScore.resolucao.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Engajamento</div>
                    <div className="font-medium">{analysis.careScore.engajamento.toFixed(1)}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <span>
                      {analysis.insights.pontosPositivos.length} pontos positivos, 
                      {analysis.insights.recomendacoes.length} recomendações
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewAnalysis(analysis)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}