import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Settings, Brain, Database, Zap, AlertTriangle } from 'lucide-react';

interface ModelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelConfigModal({ isOpen, onClose }: ModelConfigModalProps) {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    modelType: 'gemini-1.5-pro',
    accuracy: 88.5,
    trainingFrequency: 'monthly',
    autoRetrain: true,
    threshold: 0.85,
    features: ['user_behavior', 'engagement_patterns', 'payment_history'],
    apiKey: '',
    backupModel: 'gemini-1.5-flash'
  });

  const [isTraining, setIsTraining] = useState(false);

  const modelOptions = [
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: 'Máxima precisão' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', description: 'Balanceado' },
    { value: 'custom', label: 'Modelo Customizado', description: 'Treinado localmente' }
  ];

  const handleStartTraining = async () => {
    setIsTraining(true);
    
    try {
      // Simular treinamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "🤖 Treinamento iniciado",
        description: "O modelo está sendo retreinado com os dados mais recentes. Isso pode levar alguns minutos.",
      });
      
      setConfig({ ...config, accuracy: Math.min(95, config.accuracy + Math.random() * 5) });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o treinamento.",
        variant: "destructive",
      });
    } finally {
      setIsTraining(false);
    }
  };

  const handleSaveConfig = () => {
    toast({
      title: "✅ Configuração salva",
      description: "As configurações do modelo foram atualizadas com sucesso.",
    });
    onClose();
  };

  const handleTestModel = () => {
    toast({
      title: "🔄 Testando modelo",
      description: "Executando testes de precisão com dados de amostra...",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Configuração do Modelo Preditivo
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros do modelo de IA para detecção de churn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          {/* Model Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Status Atual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Precisão:</span>
                <span className="text-sm font-bold">{config.accuracy.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Último treino:</span>
                <span className="text-sm text-muted-foreground">15/01/2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Próximo treino:</span>
                <span className="text-sm text-muted-foreground">15/02/2025</span>
              </div>
            </CardContent>
          </Card>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label>Modelo Principal</Label>
            <Select value={config.modelType} onValueChange={(value) => setConfig({ ...config, modelType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Training Frequency */}
          <div className="space-y-2">
            <Label>Frequência de Retreinamento</Label>
            <Select value={config.trainingFrequency} onValueChange={(value) => setConfig({ ...config, trainingFrequency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Threshold */}
          <div className="space-y-2">
            <Label>Limite de Confiança: {config.threshold}</Label>
            <Input
              type="range"
              min="0.5"
              max="0.99"
              step="0.01"
              value={config.threshold}
              onChange={(e) => setConfig({ ...config, threshold: parseFloat(e.target.value) })}
            />
          </div>

          {/* Auto Retrain */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Retreinamento Automático</Label>
              <div className="text-sm text-muted-foreground">
                Retreinar quando a precisão cair abaixo do limite
              </div>
            </div>
            <Switch
              checked={config.autoRetrain}
              onCheckedChange={(checked) => setConfig({ ...config, autoRetrain: checked })}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={handleTestModel}
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              Testar Modelo
            </Button>
            <Button 
              variant="outline" 
              onClick={handleStartTraining}
              disabled={isTraining}
              className="w-full"
            >
              <Database className="h-4 w-4 mr-2" />
              {isTraining ? 'Treinando...' : 'Retreinar Agora'}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSaveConfig}>
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}