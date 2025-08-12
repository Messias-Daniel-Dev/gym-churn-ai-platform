import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Volume2, 
  Clock,
  TrendingUp,
  Server,
  Users
} from 'lucide-react';
import { Alert, alertService } from '@/services/ai/alertService';
import { useToast } from '@/hooks/use-toast';

export function AlertPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unresolved'>('unresolved');
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = alertService.subscribe((newAlerts) => {
      setAlerts(newAlerts);
      
      // Mostrar toast para novos alertas críticos
      const newCriticalAlerts = newAlerts.filter(
        alert => alert.type === 'critical' && !alert.resolved
      );
      
      if (newCriticalAlerts.length > 0) {
        const latestAlert = newCriticalAlerts[0];
        toast({
          title: "🚨 Alerta Crítico",
          description: latestAlert.title,
          variant: "destructive",
        });
      }
    });

    // Carregar alertas iniciais
    setAlerts(alertService.getAlerts());

    return unsubscribe;
  }, [toast]);

  const filteredAlerts = filter === 'unresolved' 
    ? alerts.filter(alert => !alert.resolved)
    : alerts;

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'info':
        return <Info className="h-4 w-4 text-info" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: Alert['category']) => {
    switch (category) {
      case 'performance':
        return <TrendingUp className="h-4 w-4" />;
      case 'churn':
        return <Users className="h-4 w-4" />;
      case 'system':
        return <Server className="h-4 w-4" />;
      case 'business':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleResolveAlert = (alertId: string) => {
    alertService.resolveAlert(alertId);
    toast({
      title: "Alerta resolvido",
      description: "O alerta foi marcado como resolvido.",
    });
  };

  const handlePlayAudio = async (alertId: string) => {
    try {
      await alertService.playAlertAudio(alertId);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível reproduzir o áudio.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  const unresolvedCount = alerts.filter(alert => !alert.resolved).length;
  const criticalCount = alerts.filter(alert => alert.type === 'critical' && !alert.resolved).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Inteligentes
            </CardTitle>
            <CardDescription>
              Monitoramento em tempo real com IA
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive">
                {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
              </Badge>
            )}
            <Badge variant="outline">
              {unresolvedCount} pendente{unresolvedCount > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === 'unresolved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unresolved')}
          >
            Pendentes ({unresolvedCount})
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos ({alerts.length})
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mb-2" />
              <p>Nenhum alerta {filter === 'unresolved' ? 'pendente' : 'encontrado'}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredAlerts.map((alert, index) => (
                <div key={alert.id}>
                  <div className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center gap-2 mt-0.5">
                          {getAlertIcon(alert.type)}
                          {getCategoryIcon(alert.category)}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium">{alert.title}</h4>
                            <Badge variant={getAlertVariant(alert.type)}>
                              {alert.type}
                            </Badge>
                            {alert.resolved && (
                              <Badge variant="outline" className="text-success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolvido
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {alert.message}
                          </p>
                          
                          {alert.recommendation && (
                            <div className="bg-muted/50 p-3 rounded-md">
                              <p className="text-sm">
                                <strong>Recomendação IA:</strong> {alert.recommendation}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(alert.timestamp)}
                            </span>
                            <span className="capitalize">{alert.category}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {alert.audioUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePlayAudio(alert.id)}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {!alert.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            Resolver
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {index < filteredAlerts.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}