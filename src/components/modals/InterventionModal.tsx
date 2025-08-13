import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, MessageSquare, Phone, Mail, Gift } from 'lucide-react';

interface RiskUser {
  name: string;
  email: string;
  risk: number;
  factor: string;
  action: string;
  lastContact: string;
}

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: RiskUser | null;
}

export function InterventionModal({ isOpen, onClose, user }: InterventionModalProps) {
  const { toast } = useToast();
  const [actionType, setActionType] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const actionOptions = [
    { value: 'whatsapp', label: 'Mensagem WhatsApp', icon: MessageSquare },
    { value: 'call', label: 'Ligação telefônica', icon: Phone },
    { value: 'email', label: 'Email personalizado', icon: Mail },
    { value: 'offer', label: 'Oferta especial', icon: Gift },
  ];

  const getDefaultMessage = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return `Olá ${user?.name}! Notamos sua ausência na academia. Que tal agendarmos uma conversa para entender como podemos te ajudar a retomar seus treinos?`;
      case 'email':
        return `Prezado(a) ${user?.name},\n\nSentimos sua falta na academia! Gostaríamos de entender os motivos e oferecer soluções personalizadas para você.`;
      case 'offer':
        return `${user?.name}, temos uma oferta especial para você! Agende uma avaliação gratuita e ganhe 1 semana de treinos personalizados.`;
      case 'call':
        return `Roteiro para ligação:\n- Cumprimentar e se identificar\n- Expressar que sentimos falta\n- Entender motivos da ausência\n- Oferecer soluções personalizadas`;
      default:
        return '';
    }
  };

  const handleActionTypeChange = (value: string) => {
    setActionType(value);
    setMessage(getDefaultMessage(value));
  };

  const handleSendIntervention = async () => {
    if (!actionType || !message.trim()) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de ação e escreva uma mensagem.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simular envio da intervenção
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "✅ Intervenção enviada",
        description: `${actionType === 'whatsapp' ? 'WhatsApp' : 
                     actionType === 'email' ? 'Email' : 
                     actionType === 'call' ? 'Ligação agendada' : 'Oferta'} enviado para ${user?.name}`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a intervenção. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Intervenção Imediata - {user.name}
          </DialogTitle>
          <DialogDescription>
            Usuário com {user.risk}% de risco de churn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{user.name}</h4>
              <Badge variant="destructive">{user.risk}% risco</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Email: {user.email}</p>
            <p className="text-sm">
              <span className="font-medium">Fator de risco:</span> {user.factor}
            </p>
            <p className="text-sm">
              <span className="font-medium">Último contato:</span> {user.lastContact}
            </p>
            <div className="p-2 bg-background rounded border">
              <p className="text-sm font-medium text-primary">Ação sugerida pela IA:</p>
              <p className="text-sm">{user.action}</p>
            </div>
          </div>

          {/* Action Type */}
          <div className="space-y-2">
            <Label>Tipo de intervenção</Label>
            <Select value={actionType} onValueChange={handleActionTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de ação" />
              </SelectTrigger>
              <SelectContent>
                {actionOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          {actionType && (
            <div className="space-y-2">
              <Label>Mensagem/Roteiro</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva a mensagem ou roteiro para a intervenção"
                rows={6}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSendIntervention} 
            disabled={!actionType || !message.trim() || isProcessing}
          >
            {isProcessing ? 'Enviando...' : 'Enviar Intervenção'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}