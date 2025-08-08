import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChurnAnalysis } from "@/components/dashboard/ChurnAnalysis";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { Users, MessageCircle, TrendingDown, ThumbsUp, Brain, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">WhatsApp Churn Bot</h1>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Sistema Ativo</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Dashboard de Análise de Churn</p>
              <p className="text-xs text-muted-foreground">Última atualização: agora</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Métricas Principais */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Métricas em Tempo Real</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Usuários Ativos"
              value="1,247"
              subtitle="Total de usuários monitorados"
              icon={Users}
              trend={{ value: 8.2, isPositive: true }}
              variant="success"
            />
            <MetricCard
              title="Conversas Diárias"
              value="89"
              subtitle="Interações nas últimas 24h"
              icon={MessageCircle}
              trend={{ value: 12.5, isPositive: true }}
              variant="default"
            />
            <MetricCard
              title="Taxa de Churn"
              value="12%"
              subtitle="Usuários em risco de cancelamento"
              icon={TrendingDown}
              trend={{ value: 2.1, isPositive: false }}
              variant="warning"
            />
            <MetricCard
              title="Índice de Satisfação"
              value="94%"
              subtitle="NPS médio dos usuários"
              icon={ThumbsUp}
              trend={{ value: 5.3, isPositive: true }}
              variant="success"
            />
          </div>
        </section>

        {/* Análise de Churn e Performance */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Análise de Churn</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <MetricCard
                title="Alto Risco"
                value="23"
                icon={TrendingDown}
                variant="danger"
              />
              <MetricCard
                title="Médio Risco"
                value="67"
                icon={TrendingDown}
                variant="warning"
              />
              <MetricCard
                title="Usuários Seguros"
                value="1,157"
                icon={Users}
                variant="success"
              />
            </div>
            <ChurnAnalysis />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Performance do Sistema</h2>
            <PerformanceMetrics />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              WhatsApp Churn Bot - Sistema Inteligente de Prevenção de Churn
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by Machine Learning & Real-time Analytics
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;