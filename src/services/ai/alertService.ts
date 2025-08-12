import { googleAI } from './googleAI';
import { openAIVoice } from './openAI';

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  category: 'performance' | 'churn' | 'system' | 'business';
  resolved: boolean;
  audioUrl?: string;
  recommendation?: string;
}

export interface MetricData {
  responseTime: number;
  resolutionRate: number;
  messagesProcessed: number;
  systemUptime: number;
  churnRate: number;
  activeUsers: number;
  errorRate: number;
}

export class AlertService {
  private alerts: Alert[] = [];
  private listeners: ((alerts: Alert[]) => void)[] = [];
  private isMonitoring = false;

  constructor() {
    this.startMonitoring();
  }

  subscribe(listener: (alerts: Alert[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.alerts));
  }

  private async analyzeMetrics(metrics: MetricData): Promise<Alert[]> {
    const newAlerts: Alert[] = [];

    // Análise de tempo de resposta crítico
    if (metrics.responseTime > 2000) {
      const alert = await this.createAlert({
        type: 'critical',
        title: 'Tempo de Resposta Crítico',
        message: `Tempo de resposta em ${metrics.responseTime}ms - muito acima do normal`,
        category: 'performance',
        metrics
      });
      newAlerts.push(alert);
    }

    // Análise de taxa de churn alta
    if (metrics.churnRate > 15) {
      const alert = await this.createAlert({
        type: 'warning',
        title: 'Taxa de Churn Elevada',
        message: `Taxa de churn em ${metrics.churnRate}% - ação imediata necessária`,
        category: 'churn',
        metrics
      });
      newAlerts.push(alert);
    }

    // Análise de taxa de erro
    if (metrics.errorRate > 5) {
      const alert = await this.createAlert({
        type: 'critical',
        title: 'Taxa de Erro Elevada',
        message: `${metrics.errorRate}% de erros detectados no sistema`,
        category: 'system',
        metrics
      });
      newAlerts.push(alert);
    }

    // Análise de queda no uptime
    if (metrics.systemUptime < 98) {
      const alert = await this.createAlert({
        type: 'warning',
        title: 'Instabilidade do Sistema',
        message: `Uptime em ${metrics.systemUptime}% - abaixo do esperado`,
        category: 'system',
        metrics
      });
      newAlerts.push(alert);
    }

    return newAlerts;
  }

  private async createAlert({
    type,
    title,
    message,
    category,
    metrics
  }: {
    type: Alert['type'];
    title: string;
    message: string;
    category: Alert['category'];
    metrics: MetricData;
  }): Promise<Alert> {
    // Gerar recomendação usando IA
    const recommendation = await this.generateRecommendation(title, message, metrics);
    
    // Gerar áudio para alertas críticos
    let audioUrl: string | undefined;
    if (type === 'critical') {
      try {
        audioUrl = await openAIVoice.textToSpeech(
          `Alerta crítico: ${title}. ${message}`,
          'nova'
        );
      } catch (error) {
        console.error('Erro ao gerar áudio do alerta:', error);
      }
    }

    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date(),
      category,
      resolved: false,
      audioUrl,
      recommendation
    };

    return alert;
  }

  private async generateRecommendation(title: string, message: string, metrics: MetricData): Promise<string> {
    try {
      const prompt = `
        Você é um especialista em análise de sistemas e performance.
        
        Alerta: ${title}
        Descrição: ${message}
        
        Métricas atuais:
        - Tempo de resposta: ${metrics.responseTime}ms
        - Taxa de resolução: ${metrics.resolutionRate}%
        - Mensagens processadas: ${metrics.messagesProcessed}
        - Uptime: ${metrics.systemUptime}%
        - Taxa de churn: ${metrics.churnRate}%
        - Usuários ativos: ${metrics.activeUsers}
        - Taxa de erro: ${metrics.errorRate}%
        
        Forneça uma recomendação específica e prática para resolver este problema em no máximo 100 palavras.
      `;

      const response = await googleAI.generateResponse(prompt);
      return response;
    } catch (error) {
      console.error('Erro ao gerar recomendação:', error);
      return 'Recomendação não disponível no momento.';
    }
  }

  private startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Simular monitoramento em tempo real (em produção, conectar com métricas reais)
    setInterval(async () => {
      const mockMetrics = this.generateMockMetrics();
      const newAlerts = await this.analyzeMetrics(mockMetrics);
      
      if (newAlerts.length > 0) {
        this.alerts.unshift(...newAlerts);
        // Manter apenas os últimos 50 alertas
        this.alerts = this.alerts.slice(0, 50);
        this.notifyListeners();
      }
    }, 30000); // Verificar a cada 30 segundos
  }

  private generateMockMetrics(): MetricData {
    // Simular métricas variáveis para demonstração
    const base = {
      responseTime: 800 + Math.random() * 1500,
      resolutionRate: 85 + Math.random() * 15,
      messagesProcessed: 1000 + Math.random() * 500,
      systemUptime: 97 + Math.random() * 3,
      churnRate: 8 + Math.random() * 12,
      activeUsers: 150 + Math.random() * 100,
      errorRate: Math.random() * 8
    };

    return base;
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  getUnresolvedAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.notifyListeners();
    }
  }

  async playAlertAudio(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert?.audioUrl) {
      const audio = new Audio(alert.audioUrl);
      await audio.play();
    }
  }
}

export const alertService = new AlertService();