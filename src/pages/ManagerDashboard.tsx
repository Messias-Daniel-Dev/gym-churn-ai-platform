import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChatAssistant } from '@/components/ai/ChatAssistant';
import { AlertPanel } from '@/components/alerts/AlertPanel';
import { SmartInsights } from '@/components/insights/SmartInsights';
import { ConversationalReports } from '@/components/reports/ConversationalReports';
import { InterventionModal } from '@/components/modals/InterventionModal';
import { CampaignModal } from '@/components/modals/CampaignModal';
import { TeamReportModal } from '@/components/modals/TeamReportModal';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  TrendingDown, 
  Heart, 
  AlertTriangle, 
  Shield, 
  Target,
  Trophy,
  Clock,
  LogOut,
  UserCheck,
  DollarSign,
  Activity,
  ChevronRight
} from 'lucide-react';

export default function ManagerDashboard() {
  const { user, logout } = useAuth();

  // Modal states
  const [interventionModal, setInterventionModal] = useState({ isOpen: false, user: null });
  const [campaignModal, setCampaignModal] = useState({ isOpen: false, campaign: null });
  const [teamReportModal, setTeamReportModal] = useState(false);

  // Add state import
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      name: 'Volta Natação',
      roi: 1800,
      success: 65,
      active: true,
      participants: 23
    },
    {
      id: '2', 
      name: 'Plano Família',
      roi: 2700,
      success: 72,
      active: true,
      participants: 18
    }
  ]);

  const riskUsers = [
    {
      name: 'Maria Silva',
      email: 'maria@email.com',
      risk: 85,
      factor: 'Baixa frequência (7 dias sem treinar)',
      action: 'Oferecer aula experimental gratuita',
      lastContact: '2 dias atrás'
    },
    {
      name: 'João Santos',
      email: 'joao@email.com', 
      risk: 89,
      factor: 'Pagamento em atraso há 5 dias',
      action: 'Enviar link de parcelamento',
      lastContact: 'Nunca'
    },
    {
      name: 'Ana Costa',
      email: 'ana@email.com',
      risk: 78,
      factor: 'Cancelou 2 aulas seguidas',
      action: 'Remarcar aula com personal',
      lastContact: '1 dia atrás'
    }
  ];

  const teamPerformance = [
    { name: 'Ana Costa', actions: 45, success: 92, avgTime: '2.1min' },
    { name: 'Bruno Lima', actions: 38, success: 88, avgTime: '2.8min' },
    { name: 'Carla Santos', actions: 31, success: 85, avgTime: '3.2min' },
  ];

  // Modal handlers
  const handleIntervention = (user: any) => {
    setInterventionModal({ isOpen: true, user });
  };

  const handleCampaignManage = (campaign: any) => {
    setCampaignModal({ isOpen: true, campaign });
  };

  const handleCreateCampaign = () => {
    setCampaignModal({ isOpen: true, campaign: null });
  };

  const handleSaveCampaign = (campaignData: any) => {
    if (campaignData.id && campaigns.find(c => c.id === campaignData.id)) {
      setCampaigns(campaigns.map(c => c.id === campaignData.id ? campaignData : c));
    } else {
      setCampaigns([...campaigns, { ...campaignData, id: Date.now().toString() }]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Dashboard do Gestor</h1>
                <p className="text-sm text-muted-foreground">Gestão de churn e performance da equipe</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Gestor
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Usuários Ativos"
            value="1,247"
            subtitle="usuários ativos hoje"
            icon={Users}
            trend={{ value: 5.2, isPositive: true }}
          />
          <MetricCard
            title="Conversas Diárias"
            value="89"
            subtitle="conversas hoje"
            icon={MessageSquare}
            trend={{ value: 2.1, isPositive: true }}
          />
          <MetricCard
            title="Taxa de Churn"
            value="12%"
            subtitle="últimos 30 dias"
            icon={TrendingDown}
            trend={{ value: 1.8, isPositive: false }}
          />
          <MetricCard
            title="Alunos Retidos"
            value="23"
            subtitle="retidos este mês"
            icon={Heart}
            trend={{ value: 12.5, isPositive: true }}
          />
          <MetricCard
            title="ROI das Ações"
            value="R$ 4.500"
            subtitle="economia estimada"
            icon={DollarSign}
            trend={{ value: 18.2, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Ação Imediata Necessária
              </CardTitle>
              <CardDescription>
                Usuários em alto risco que precisam de intervenção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {riskUsers.map((user, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant="destructive">
                      {user.risk}% risco
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Fator:</span> {user.factor}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Último contato:</span> {user.lastContact}
                    </p>
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-sm font-medium text-primary">Ação sugerida:</p>
                      <p className="text-sm">{user.action}</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleIntervention(user)}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Intervir Agora
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Performance da Equipe
              </CardTitle>
              <CardDescription>
                Últimos 7 dias - Ranking por efetividade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamPerformance.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.actions} ações • {member.success}% sucesso
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {member.avgTime}
                    </p>
                    <p className="text-xs text-muted-foreground">tempo médio</p>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setTeamReportModal(true)}
              >
                Ver Relatório Completo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Campanhas de Retenção Ativas
            </CardTitle>
            <CardDescription>
              Monitoramento de campanhas em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((campaign, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Campanha '{campaign.name}'</h4>
                    <Badge variant={campaign.active ? 'default' : 'secondary'}>
                      {campaign.active ? 'Ativa' : 'Pausada'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">ROI</p>
                      <p className="font-medium text-success">+R$ {campaign.roi.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Taxa de Sucesso</p>
                      <p className="font-medium">{campaign.success}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      {campaign.participants} participantes
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCampaignManage(campaign)}
                    >
                      Gerenciar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleCreateCampaign}
              >
                <Target className="w-4 h-4 mr-2" />
                Criar Nova Campanha
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SmartInsights autoRefresh={true} />
          <AlertPanel />
        </div>

        {/* Conversational Reports */}
        <ConversationalReports />
      </div>

      {/* Modals */}
      <InterventionModal
        isOpen={interventionModal.isOpen}
        onClose={() => setInterventionModal({ isOpen: false, user: null })}
        user={interventionModal.user}
      />

      <CampaignModal
        isOpen={campaignModal.isOpen}
        onClose={() => setCampaignModal({ isOpen: false, campaign: null })}
        campaign={campaignModal.campaign}
        onSave={handleSaveCampaign}
      />

      <TeamReportModal
        isOpen={teamReportModal}
        onClose={() => setTeamReportModal(false)}
      />
      
      <ChatAssistant
        context={{
          kpis: {
            totalUsers: 1247,
            churnRate: 12,
            retentionRate: 87.7,
            avgLifeValue: 2450
          },
          riskUsers: [
            { name: 'Maria Silva', email: 'maria@email.com', risk: 85, factor: 'Baixa frequência (7 dias sem treinar)' },
            { name: 'João Santos', email: 'joao@email.com', risk: 89, factor: 'Pagamento em atraso há 5 dias' },
            { name: 'Ana Costa', email: 'ana@email.com', risk: 78, factor: 'Cancelou 2 aulas seguidas' }
          ],
          teamPerformance: [
            { name: 'Ana Costa', actions: 45, success: 92, avgTime: '2.1min' },
            { name: 'Bruno Lima', actions: 38, success: 88, avgTime: '2.8min' },
            { name: 'Carla Santos', actions: 31, success: 85, avgTime: '3.2min' }
          ],
          campaigns: [
            { name: 'Volta Natação', roi: 1800, success: 65, participants: 23 },
            { name: 'Plano Família', roi: 2700, success: 72, participants: 18 }
          ]
        }}
        title="Assistente Gestor"
        placeholder="Analise KPIs, usuários em risco ou campanhas..."
      />
    </div>
  );
}