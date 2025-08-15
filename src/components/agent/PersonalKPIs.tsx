import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Target, BarChart3, Trophy } from 'lucide-react';
import { AgentPerformance } from '@/types/care';

interface PersonalKPIsProps {
  performance: AgentPerformance;
}

export function PersonalKPIs({ performance }: PersonalKPIsProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-success';
    if (score >= 3) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 4) return 'default';
    if (score >= 3) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Score C.A.R.E. Médio</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className={`text-2xl font-bold ${getScoreColor(performance.averageCAREScore.total)}`}>
              {performance.averageCAREScore.total.toFixed(1)}
            </div>
            <Badge variant={getScoreBadgeVariant(performance.averageCAREScore.total)}>
              /5.0
            </Badge>
          </div>
          <div className={`flex items-center space-x-1 text-xs ${getTrendColor(performance.trend)}`}>
            {getTrendIcon(performance.trend)}
            <span>
              {performance.trend === 'up' && 'Melhorando'}
              {performance.trend === 'down' && 'Precisa atenção'}
              {performance.trend === 'stable' && 'Estável'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{performance.totalAnalyses}</div>
          <p className="text-xs text-muted-foreground">
            Conversas analisadas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ranking da Equipe</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#{performance.rank}</div>
          <p className="text-xs text-muted-foreground">
            Posição atual
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ponto Forte</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {performance.strongestPillar}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${getScoreColor(performance.averageCAREScore[performance.strongestPillar])}`}>
              {performance.averageCAREScore[performance.strongestPillar].toFixed(1)}/5.0
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}