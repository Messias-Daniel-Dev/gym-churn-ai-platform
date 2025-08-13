import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Shield, Clock } from 'lucide-react';

interface SystemUser {
  id?: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Gestor' | 'Agente';
  status: 'active' | 'inactive';
  lastAccess?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: SystemUser | null;
  onSave: (user: SystemUser) => void;
}

export function UserModal({ isOpen, onClose, user, onSave }: UserModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SystemUser>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Agente',
    status: user?.status || 'active'
  });

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      ...formData,
      id: user?.id || Date.now().toString(),
      lastAccess: user?.lastAccess || 'Nunca'
    };

    onSave(userData);
    toast({
      title: user ? "Usuário atualizado" : "Usuário criado",
      description: `${formData.name} foi ${user ? 'atualizado' : 'criado'} com sucesso.`,
    });
    onClose();
  };

  const isEditing = !!user;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isEditing ? 'Editar Usuário' : 'Adicionar Usuário'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do usuário abaixo.'
              : 'Adicione um novo usuário ao sistema.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Função</Label>
            <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agente">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Agente
                  </div>
                </SelectItem>
                <SelectItem value="Gestor">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Gestor
                  </div>
                </SelectItem>
                <SelectItem value="Administrador">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Administrador
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="status">Status do usuário</Label>
              <div className="text-sm text-muted-foreground">
                Usuário {formData.status === 'active' ? 'ativo' : 'inativo'} no sistema
              </div>
            </div>
            <Switch
              id="status"
              checked={formData.status === 'active'}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
              }
            />
          </div>

          {isEditing && user?.lastAccess && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Último acesso: {user.lastAccess}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? 'Salvar alterações' : 'Criar usuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}