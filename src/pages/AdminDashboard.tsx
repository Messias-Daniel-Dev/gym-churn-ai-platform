import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { ChatAssistant } from '@/components/ai/ChatAssistant';
import { AlertPanel } from '@/components/alerts/AlertPanel';
import { 
  Server, 
  Database, 
  Bot, 
  Activity, 
  Users, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  LogOut,
  Shield,
  FileText
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const systemServices = [
    { name: 'API FastAPI', status: 'online', uptime: '99.9%', icon: Server },
    { name: 'PostgreSQL', status: 'online', uptime: '99.8%', icon: Database },
    { name: 'Agente IA', status: 'online', uptime: '98.5%', icon: Bot },
    { name: 'API WhatsApp', status: 'warning', uptime: '97.2%', icon: Activity },
  ];

  const systemUsers = [
    { name: 'Guilherme Silva', role: 'Gestor', lastAccess: '2h atrás', status: 'active' },
    { name: 'Ana Costa', role: 'Agente', lastAccess: '15min atrás', status: 'active' },
    { name: 'Bruno Lima', role: 'Agente', lastAccess: '1h atrás', status: 'active' },
    { name: 'Carla Santos', role: 'Agente', lastAccess: '1 dia atrás', status: 'inactive' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Painel do Administrador</h1>
                <p className="text-sm text-muted-foreground">Controle total do sistema</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Administrador
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
        {/* System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Saúde do Sistema
              </CardTitle>
              <CardDescription>
                Status dos serviços em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground">{service.uptime}</span>
                      <Badge variant={service.status === 'online' ? 'default' : 'secondary'}>
                        {service.status === 'online' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {service.status === 'online' ? 'Online' : 'Atenção'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                Modelo Preditivo
              </CardTitle>
              <CardDescription>
                Status do modelo de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Precisão Atual</span>
                  <span className="font-medium">88.5%</span>
                </div>
                <Progress value={88.5} className="h-2" />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Último Treinamento</span>
                  <span className="text-sm text-muted-foreground">15/01/2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Próximo Treinamento</span>
                  <span className="text-sm text-muted-foreground">15/02/2025</span>
                </div>
                <Button className="w-full" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar Modelo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Gestão de Usuários
            </CardTitle>
            <CardDescription>
              Controle de acesso e permissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {user.lastAccess}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={user.role === 'Gestor' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Adicionar Usuário
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Logs do Sistema
            </CardTitle>
            <CardDescription>
              Atividade recente do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div className="p-2 bg-muted rounded text-muted-foreground">
                [INFO] 2025-01-15 14:32:15 - API: GET /usuarios_risco - 200 OK
              </div>
              <div className="p-2 bg-muted rounded text-muted-foreground">
                [INFO] 2025-01-15 14:31:42 - Worker: Análise de churn executada com sucesso
              </div>
              <div className="p-2 bg-destructive/10 rounded text-destructive">
                [WARN] 2025-01-15 14:30:18 - API WhatsApp: Latência alta detectada (3.2s)
              </div>
              <div className="p-2 bg-muted rounded text-muted-foreground">
                [INFO] 2025-01-15 14:29:55 - Login: gestor@demo.com autenticado
              </div>
              <div className="p-2 bg-muted rounded text-muted-foreground">
                [INFO] 2025-01-15 14:28:31 - Modelo: Predição executada para 1247 usuários
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas Inteligentes */}
        <AlertPanel />
      </div>
      
      <ChatAssistant
        context={{
          systemHealth: {
            api: { status: 'online', uptime: '99.9%' },
            database: { status: 'online', uptime: '99.8%' },
            aiAgent: { status: 'online', uptime: '98.5%' },
            whatsapp: { status: 'online', uptime: '97.2%' }
          },
          users: [
            { name: 'João Silva', role: 'Admin', lastAccess: '2 min atrás', status: 'active' },
            { name: 'Maria Santos', role: 'Manager', lastAccess: '15 min atrás', status: 'active' },
            { name: 'Pedro Costa', role: 'Manager', lastAccess: '1 hora atrás', status: 'inactive' }
          ],
          logs: [
            { time: '14:30', type: 'INFO', message: 'Sistema de backup executado com sucesso' },
            { time: '14:25', type: 'INFO', message: 'Novo usuário cadastrado: ana@empresa.com' },
            { time: '14:20', type: 'WARN', message: 'Alto uso de CPU detectado (85%)' }
          ]
        }}
        title="Assistente Admin"
        placeholder="Pergunte sobre o sistema, usuários ou logs..."
      />
    </div>
  );
}