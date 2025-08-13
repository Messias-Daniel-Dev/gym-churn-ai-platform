import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  MessageSquare,
  CheckCircle,
  Download,
  BarChart3
} from 'lucide-react';

interface TeamMember {
  name: string;
  actions: number;
  success: number;
  avgTime: string;
  conversions: number;
  satisfaction: number;
  responseTime: number;
}

interface TeamReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fullTeamData: TeamMember[] = [
  { 
    name: 'Ana Costa', 
    actions: 45, 
    success: 92, 
    avgTime: '2.1min',
    conversions: 38,
    satisfaction: 4.8,
    responseTime: 1.2
  },
  { 
    name: 'Bruno Lima', 
    actions: 38, 
    success: 88, 
    avgTime: '2.8min',
    conversions: 29,
    satisfaction: 4.5,
    responseTime: 1.8
  },
  { 
    name: 'Carla Santos', 
    actions: 31, 
    success: 85, 
    avgTime: '3.2min',
    conversions: 24,
    satisfaction: 4.3,
    responseTime: 2.1
  },
  { 
    name: 'Diego Rocha', 
    actions: 29, 
    success: 82, 
    avgTime: '3.5min',
    conversions: 22,
    satisfaction: 4.2,
    responseTime: 2.3
  },
  { 
    name: 'Elena Ferreira', 
    actions: 26, 
    success: 79, 
    avgTime: '3.8min',
    conversions: 19,
    satisfaction: 4.0,
    responseTime: 2.7
  }
];

export function TeamReportModal({ isOpen, onClose }: TeamReportModalProps) {
  const totalActions = fullTeamData.reduce((sum, member) => sum + member.actions, 0);
  const avgSuccess = fullTeamData.reduce((sum, member) => sum + member.success, 0) / fullTeamData.length;
  const totalConversions = fullTeamData.reduce((sum, member) => sum + member.conversions, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Relatório Completo da Equipe
          </DialogTitle>
          <DialogDescription>
            Performance detalhada de todos os agentes - Últimos 7 dias
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <div className="text-sm font-medium">Total de Ações</div>
                </div>
                <div className="text-2xl font-bold mt-1">{totalActions}</div>
                <div className="text-xs text-muted-foreground">+12% vs semana anterior</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <div className="text-sm font-medium">Taxa Média</div>
                </div>
                <div className="text-2xl font-bold mt-1">{avgSuccess.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">+3.2% vs semana anterior</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <div className="text-sm font-medium">Conversões</div>
                </div>
                <div className="text-2xl font-bold mt-1">{totalConversions}</div>
                <div className="text-xs text-muted-foreground">+8% vs semana anterior</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Individual</CardTitle>
              <CardDescription>Métricas detalhadas por agente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fullTeamData.map((member, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {member.actions} ações • {member.conversions} conversões
                          </p>
                        </div>
                      </div>
                      <Badge variant={member.success >= 90 ? 'default' : member.success >= 85 ? 'secondary' : 'outline'}>
                        {member.success}% sucesso
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Tempo Médio</div>
                        <div className="font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {member.avgTime}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Satisfação</div>
                        <div className="font-medium">{member.satisfaction}/5.0 ⭐</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Resp. Média</div>
                        <div className="font-medium">{member.responseTime}min</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Taxa de Sucesso</div>
                        <div className="mt-1">
                          <Progress value={member.success} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" className="flex-1">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Análise Detalhada
            </Button>
            <Button onClick={onClose} className="flex-1">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}