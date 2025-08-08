import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, MessageSquare, Zap } from "lucide-react";

interface PerformanceMetric {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  target: number;
}

const performanceData: PerformanceMetric[] = [
  {
    label: "Tempo de Resposta",
    value: 2.3,
    unit: "s",
    icon: Clock,
    color: "text-primary",
    target: 5
  },
  {
    label: "Taxa de Resolução", 
    value: 87,
    unit: "%",
    icon: CheckCircle,
    color: "text-success",
    target: 90
  },
  {
    label: "Mensagens Processadas",
    value: 15678,
    unit: "",
    icon: MessageSquare,
    color: "text-warning",
    target: 20000
  },
  {
    label: "Uptime do Sistema",
    value: 99.9,
    unit: "%", 
    icon: Zap,
    color: "text-success",
    target: 99.5
  }
];

export function PerformanceMetrics() {
  const formatValue = (value: number, unit: string) => {
    if (value > 1000 && unit === "") {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return `${value}${unit}`;
  };

  const getProgressPercentage = (value: number, target: number, unit: string) => {
    if (unit === "s") {
      // Para tempo de resposta, menor é melhor
      return Math.max(0, 100 - (value / target) * 100);
    }
    return Math.min(100, (value / target) * 100);
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Performance do Chatbot</h3>
        <p className="text-sm text-muted-foreground">Métricas de desempenho em tempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {performanceData.map((metric, index) => {
          const Icon = metric.icon;
          const progressPercentage = getProgressPercentage(metric.value, metric.target, metric.unit);
          
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium text-foreground">{metric.label}</span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  {formatValue(metric.value, metric.unit)}
                </span>
              </div>
              
              <div className="space-y-1">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Meta: {formatValue(metric.target, metric.unit)}</span>
                  <span>{progressPercentage.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}