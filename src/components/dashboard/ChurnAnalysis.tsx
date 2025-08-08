import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, TrendingDown, MessageCircle } from "lucide-react";

interface ChurnUser {
  id: string;
  name: string;
  phone: string;
  riskLevel: "high" | "medium" | "low";
  lastActivity: string;
  churnScore: number;
  totalMessages: number;
}

const mockChurnUsers: ChurnUser[] = [
  {
    id: "1",
    name: "Maria Silva",
    phone: "+55 11 99999-0001",
    riskLevel: "high",
    lastActivity: "5 dias atrás",
    churnScore: 89,
    totalMessages: 12
  },
  {
    id: "2", 
    name: "João Santos",
    phone: "+55 11 99999-0002",
    riskLevel: "high",
    lastActivity: "3 dias atrás",
    churnScore: 85,
    totalMessages: 8
  },
  {
    id: "3",
    name: "Ana Costa",
    phone: "+55 11 99999-0003", 
    riskLevel: "medium",
    lastActivity: "2 dias atrás",
    churnScore: 64,
    totalMessages: 24
  },
  {
    id: "4",
    name: "Pedro Lima",
    phone: "+55 11 99999-0004",
    riskLevel: "medium", 
    lastActivity: "1 dia atrás",
    churnScore: 58,
    totalMessages: 31
  }
];

export function ChurnAnalysis() {
  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "high": return "destructive";
      case "medium": return "warning"; 
      case "low": return "success";
      default: return "secondary";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high": return <AlertTriangle className="h-4 w-4" />;
      case "medium": return <TrendingDown className="h-4 w-4" />;
      case "low": return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Usuários em Risco</h3>
          <p className="text-sm text-muted-foreground">Análise de churn em tempo real</p>
        </div>
        <Button variant="outline" size="sm">
          Ver Todos
        </Button>
      </div>

      <div className="space-y-4">
        {mockChurnUsers.map((user) => (
          <div 
            key={user.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getRiskIcon(user.riskLevel)}
                <div>
                  <h4 className="font-medium text-foreground">{user.name}</h4>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{user.totalMessages} msgs</span>
                </div>
                <p className="text-xs text-muted-foreground">{user.lastActivity}</p>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-foreground mb-1">
                  {user.churnScore}% risco
                </div>
                <Badge variant={getRiskBadgeVariant(user.riskLevel)} className="text-xs">
                  {user.riskLevel === "high" ? "Alto" : user.riskLevel === "medium" ? "Médio" : "Baixo"}
                </Badge>
              </div>

              <Button variant="outline" size="sm">
                Intervir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}