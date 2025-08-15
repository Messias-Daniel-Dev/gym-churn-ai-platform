import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, Legend } from 'recharts';
import { CAREScore } from '@/types/care';

interface CARERadarProps {
  careScore: CAREScore;
  title?: string;
}

export function CARERadar({ careScore, title = "Performance C.A.R.E." }: CARERadarProps) {
  const data = [
    {
      name: 'Conexão',
      score: careScore.conexao,
      percentage: (careScore.conexao / 5) * 100,
      fill: 'hsl(var(--primary))'
    },
    {
      name: 'Análise',
      score: careScore.analise,
      percentage: (careScore.analise / 5) * 100,
      fill: 'hsl(var(--accent))'
    },
    {
      name: 'Resolução',
      score: careScore.resolucao,
      percentage: (careScore.resolucao / 5) * 100,
      fill: 'hsl(var(--warning))'
    },
    {
      name: 'Engajamento',
      score: careScore.engajamento,
      percentage: (careScore.engajamento / 5) * 100,
      fill: 'hsl(var(--success))'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-success';
    if (score >= 3) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="80%"
              data={data}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                dataKey="percentage"
                cornerRadius={10}
                fill="fill"
                stroke="none"
              />
              <Legend
                iconSize={10}
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
                formatter={(value, entry) => (
                  <span className={getScoreColor((entry.payload as any).score)}>
                    {value}: {((entry.payload as any).score as number).toFixed(1)}/5.0
                  </span>
                )}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          {data.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="text-sm font-medium">{item.name}</div>
              <div className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                {item.score.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}