import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, Mic, MicOff, FileAudio, Trash2 } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { CAREAnalysisService } from '@/services/ai/careAnalysisService';

interface AudioUploaderProps {
  onAnalysisComplete: (analysis: any) => void;
  agentId: string;
}

export function AudioUploader({ onAnalysisComplete, agentId }: AudioUploaderProps) {
  const [leadName, setLeadName] = useState('');
  const [transcription, setTranscription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { isRecording, startRecording, stopRecording } = useVoiceRecording();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setUploadedFile(file);
        toast({
          title: "Arquivo carregado",
          description: `${file.name} foi carregado com sucesso.`,
        });
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo de áudio.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRecordToggle = async () => {
    if (isRecording) {
      try {
        const recordedText = await stopRecording();
        if (recordedText) {
          setTranscription(recordedText);
          toast({
            title: "Gravação concluída",
            description: "Áudio transcrito com sucesso.",
          });
        }
      } catch (error) {
        toast({
          title: "Erro na gravação",
          description: "Não foi possível processar a gravação.",
          variant: "destructive",
        });
      }
    } else {
      try {
        await startRecording();
        toast({
          title: "Gravação iniciada",
          description: "Fale sobre sua conversa com o lead.",
        });
      } catch (error) {
        toast({
          title: "Erro no microfone",
          description: "Não foi possível acessar o microfone.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!transcription.trim()) {
      toast({
        title: "Transcrição necessária",
        description: "Digite ou grave a conversa antes de analisar.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simula progresso da análise
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const analysis = await CAREAnalysisService.analyzeConversation(
        transcription,
        agentId,
        leadName || undefined
      );

      setAnalysisProgress(100);
      
      setTimeout(() => {
        onAnalysisComplete(analysis);
        // Reset form
        setLeadName('');
        setTranscription('');
        setUploadedFile(null);
        setAnalysisProgress(0);
        setIsAnalyzing(false);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);

      toast({
        title: "Análise concluída",
        description: "Sua conversa foi analisada com sucesso!",
      });

    } catch (error) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      
      toast({
        title: "Erro na análise",
        description: "Não foi possível analisar a conversa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setLeadName('');
    setTranscription('');
    setUploadedFile(null);
    setAnalysisProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Análise de Conversa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nome do Lead */}
        <div className="space-y-2">
          <Label htmlFor="leadName">Nome do Lead (Opcional)</Label>
          <Input
            id="leadName"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            placeholder="Ex: João Silva"
            disabled={isAnalyzing}
          />
        </div>

        {/* Upload de Áudio */}
        <div className="space-y-2">
          <Label>Upload de Áudio</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isAnalyzing}
            />
            
            {uploadedFile ? (
              <div className="flex items-center justify-center space-x-3">
                <FileAudio className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setUploadedFile(null)}
                  disabled={isAnalyzing}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Arraste um arquivo de áudio ou clique para selecionar
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                  disabled={isAnalyzing}
                >
                  Selecionar Arquivo
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Gravação de Voz */}
        <div className="space-y-2">
          <Label>Ou grave sua conversa</Label>
          <div className="flex justify-center">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="lg"
              onClick={handleRecordToggle}
              disabled={isAnalyzing}
              className="w-full max-w-xs"
            >
              {isRecording ? (
                <>
                  <MicOff className="h-5 w-5 mr-2" />
                  Parar Gravação
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2" />
                  Iniciar Gravação
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Transcrição */}
        <div className="space-y-2">
          <Label htmlFor="transcription">Transcrição da Conversa</Label>
          <Textarea
            id="transcription"
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder="Digite ou grave o conteúdo da sua conversa com o lead..."
            rows={6}
            disabled={isAnalyzing}
          />
          <p className="text-xs text-muted-foreground">
            Descreva a conversa com o máximo de detalhes possível para uma análise mais precisa.
          </p>
        </div>

        {/* Progresso da Análise */}
        {isAnalyzing && (
          <div className="space-y-2">
            <Label>Analisando conversa...</Label>
            <Progress value={analysisProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              A Athena está analisando sua conversa ({analysisProgress}%)
            </p>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex space-x-3">
          <Button
            onClick={handleAnalyze}
            disabled={!transcription.trim() || isAnalyzing}
            className="flex-1"
          >
            {isAnalyzing ? "Analisando..." : "Analisar Conversa"}
          </Button>
          
          <Button
            variant="outline"
            onClick={clearAll}
            disabled={isAnalyzing}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}