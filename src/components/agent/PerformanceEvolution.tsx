import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AgentPerformance } from '@/types/care';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PerformanceEvolutionProps {
  performance: AgentPerformance;
}

export function PerformanceEvolution({ performance }: PerformanceEvolutionProps) {
  const chartData = performance.evolution.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'dd/MM', { locale: ptBR })
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Data: ${label}`}</p>
          <p className="text-sm">
            <span className="text-primary">Score: </span>
            <span className="font-bold">{payload[0].value.toFixed(1)}/5.0</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const averageScore = performance.averageCAREScore.total;
  const lastScore = performance.evolution[performance.evolution.length - 1]?.score || 0;
  const trend = lastScore > averageScore ? 'up' : lastScore < averageScore ? 'down' : 'stable';
  
  const trendMessage = {
    up: 'Tendência de melhoria! 📈',
    down: 'Oportunidade de crescimento 📉',
    stable: 'Performance estável 📊'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Performance</CardTitle>
        <p className="text-sm text-muted-foreground">
          {trendMessage[trend]}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="formattedDate" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 5]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Atual</div>
            <div className="text-lg font-bold text-primary">
              {lastScore.toFixed(1)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Média</div>
            <div className="text-lg font-bold">
              {averageScore.toFixed(1)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Meta</div>
            <div className="text-lg font-bold text-accent">
              4.5
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}