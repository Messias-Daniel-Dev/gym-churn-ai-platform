import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Target, Users, Calendar, TrendingUp } from 'lucide-react';

interface Campaign {
  id?: string;
  name: string;
  description: string;
  type: 'retention' | 'engagement' | 'winback' | 'custom';
  targetAudience: string;
  message: string;
  duration: number;
  isActive: boolean;
}

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: Campaign | null;
  onSave: (campaign: Campaign) => void;
}

export function CampaignModal({ isOpen, onClose, campaign, onSave }: CampaignModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Campaign>({
    name: campaign?.name || '',
    description: campaign?.description || '',
    type: campaign?.type || 'retention',
    targetAudience: campaign?.targetAudience || '',
    message: campaign?.message || '',
    duration: campaign?.duration || 7,
    isActive: campaign?.isActive || true
  });

  const campaignTypes = [
    { value: 'retention', label: 'Retenção', description: 'Evitar cancelamentos' },
    { value: 'engagement', label: 'Engajamento', description: 'Aumentar atividade' },
    { value: 'winback', label: 'Reconquista', description: 'Trazer usuários inativos' },
    { value: 'custom', label: 'Personalizada', description: 'Campanha customizada' }
  ];

  const getDefaultMessage = (type: string) => {
    switch (type) {
      case 'retention':
        return 'Olá! Notamos que você pode estar pensando em pausar seus treinos. Que tal conversarmos sobre como podemos te ajudar a manter sua rotina?';
      case 'engagement':
        return 'Ei! Vamos dar aquele gás nos treinos? Temos novidades incríveis esperando por você na academia!';
      case 'winback':
        return 'Sentimos sua falta! Que tal voltar com tudo? Temos uma oferta especial para você retomar seus treinos.';
      default:
        return '';
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData({ 
      ...formData, 
      type: value as Campaign['type'],
      message: getDefaultMessage(value)
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.targetAudience || !formData.message) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const campaignData = {
      ...formData,
      id: campaign?.id || Date.now().toString()
    };

    onSave(campaignData);
    toast({
      title: campaign ? "Campanha atualizada" : "Campanha criada",
      description: `${formData.name} foi ${campaign ? 'atualizada' : 'criada'} com sucesso.`,
    });
    onClose();
  };

  const isEditing = !!campaign;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {isEditing ? 'Editar Campanha' : 'Nova Campanha de Retenção'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite os dados da campanha abaixo.'
              : 'Configure uma nova campanha para engajar seus usuários.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome da campanha *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Volta Natação, Plano Família..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Breve descrição da campanha"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Tipo de campanha</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {campaignTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="audience">Público-alvo *</Label>
            <Input
              id="audience"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="Ex: Usuários inativos há 5+ dias, Planos premium..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="duration">Duração (dias)</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                id="duration"
                type="number"
                min="1"
                max="30"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 7 })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Mensagem da campanha *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Mensagem que será enviada aos usuários"
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="active">Campanha ativa</Label>
              <div className="text-sm text-muted-foreground">
                {formData.isActive ? 'Campanha será iniciada imediatamente' : 'Campanha ficará pausada'}
              </div>
            </div>
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? 'Salvar alterações' : 'Criar campanha'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}