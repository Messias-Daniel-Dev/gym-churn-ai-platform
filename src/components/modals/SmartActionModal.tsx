import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Zap, MessageSquare, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';

interface SmartAction {
  id: string;
  title: string;
  description: string;
  type: 'immediate' | 'scheduled' | 'automated';
  priority: 'high' | 'medium' | 'low';
  impact: string;
  effort: string;
}

interface SmartActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: SmartAction | null;
}

export function SmartActionModal({ isOpen, onClose, action }: SmartActionModalProps) {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);

  const actionMethods = [
    { value: 'whatsapp', label: 'WhatsApp em massa', icon: MessageSquare, description: 'Enviar para usuários selecionados' },
    { value: 'email', label: 'Campanha de email', icon: Mail, description: 'Email personalizado por segmento' },
    { value: 'call', label: 'Ligações direcionadas', icon: Phone, description: 'Contato telefônico prioritário' },
    { value: 'schedule', label: 'Agendar automação', icon: Calendar, description: 'Configurar ação futura' }
  ];

  const getDefaultMessage = () => {
    if (!action) return '';
    
    switch (action.id) {
      case 'engagement':
        return 'Olá! Notamos que você não tem visitado a academia. Que tal voltarmos juntos? Temos uma oferta especial esperando por você! 🏃‍♂️';
      case 'retention':
        return 'Oi! Sentimos sua falta na academia. Vamos conversar sobre como podemos te ajudar a manter seus objetivos? Nossa equipe está aqui para você! 💪';
      case 'recovery':
        return 'Que bom te ver de volta! Preparamos um plano especial para te ajudar a retomar seus treinos. Vamos conversar? 🎯';
      default:
        return 'Mensagem personalizada baseada no insight gerado pela IA.';
    }
  };

  const handleExecuteAction = async () => {
    if (!selectedMethod) {
      toast({
        title: "Erro",
        description: "Selecione um método de execução.",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);

    try {
      // Simular execução da ação
      await new Promise(resolve => setTimeout(resolve, 2000));

      const methodLabel = actionMethods.find(m => m.value === selectedMethod)?.label;
      
      toast({
        title: "✅ Ação executada",
        description: `${methodLabel} foi iniciada com sucesso. Acompanhe os resultados no painel.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível executar a ação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  React.useEffect(() => {
    if (action) {
      setCustomMessage(getDefaultMessage());
    }
  }, [action]);

  if (!action) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Executar Ação Inteligente
          </DialogTitle>
          <DialogDescription>
            Implemente a recomendação gerada pela IA
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Summary */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{action.title}</h4>
                  <Badge variant={action.priority === 'high' ? 'destructive' : action.priority === 'medium' ? 'default' : 'secondary'}>
                    {action.priority === 'high' ? 'Alta' : action.priority === 'medium' ? 'Média' : 'Baixa'} prioridade
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Impacto esperado:</span>
                    <p className="font-medium">{action.impact}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Esforço necessário:</span>
                    <p className="font-medium">{action.effort}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Method Selection */}
          <div className="space-y-2">
            <Label>Método de execução</Label>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione como executar a ação" />
              </SelectTrigger>
              <SelectContent>
                {actionMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-start gap-2">
                        <Icon className="h-4 w-4 mt-0.5" />
                        <div>
                          <div className="font-medium">{method.label}</div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Message Customization */}
          {selectedMethod && selectedMethod !== 'schedule' && (
            <div className="space-y-2">
              <Label>Personalizar mensagem</Label>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Edite a mensagem que será enviada"
                rows={4}
              />
            </div>
          )}

          {/* Expected Results */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Resultados esperados</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Redução de {Math.floor(Math.random() * 20 + 10)}% no churn</li>
              <li>• Aumento de {Math.floor(Math.random() * 15 + 5)}% no engajamento</li>
              <li>• ROI estimado de R$ {(Math.random() * 5000 + 1000).toFixed(0)}</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isExecuting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleExecuteAction} 
            disabled={!selectedMethod || isExecuting}
          >
            {isExecuting ? 'Executando...' : 'Executar Ação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}