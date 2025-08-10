import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { googleAI } from '@/services/ai/googleAI';
import { openAIVoice } from '@/services/ai/openAI';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string; // For TTS audio
}

interface ChatAssistantProps {
  context?: any;
  title?: string;
  placeholder?: string;
}

export function ChatAssistant({ 
  context, 
  title = "Assistente IA",
  placeholder = "Faça uma pergunta sobre os dados..."
}: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente de IA. Como posso ajudar você hoje?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceRecording();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const playAudio = async (audioUrl: string) => {
    try {
      setIsPlayingAudio(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlayingAudio(false);
      await audioRef.current.play();
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      setIsPlayingAudio(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      try {
        const transcription = await stopRecording();
        setInputValue(transcription);
      } catch (error) {
        console.error('Erro na transcrição:', error);
      }
    } else {
      try {
        await startRecording();
      } catch (error) {
        console.error('Erro ao iniciar gravação:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let response: string;
      
      if (context) {
        // Gemini analyzes dashboard data
        response = await googleAI.analyzeData(context, inputValue);
      } else {
        // Gemini for general conversation
        response = await googleAI.generateResponse(inputValue);
      }

      let audioUrl: string | undefined;
      
      // Generate voice response if enabled
      if (voiceEnabled) {
        try {
          audioUrl = await openAIVoice.textToSpeech(response);
        } catch (error) {
          console.error('Erro ao gerar áudio:', error);
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
        audioUrl
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-play audio if voice is enabled
      if (audioUrl && voiceEnabled) {
        setTimeout(() => playAudio(audioUrl), 500);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`h-6 w-6 p-0 ${voiceEnabled ? 'text-primary' : 'text-muted-foreground'}`}
          >
            {voiceEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.content}
                  {message.audioUrl && message.sender === 'assistant' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playAudio(message.audioUrl!)}
                      className="ml-2 h-6 w-6 p-0"
                      disabled={isPlayingAudio}
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {message.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3 w-3 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <div className="bg-muted text-muted-foreground rounded-lg p-3 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading || isRecording || isTranscribing}
            className="flex-1"
          />
          <Button 
            onClick={handleVoiceInput}
            disabled={isLoading || isTranscribing}
            size="icon"
            variant={isRecording ? "destructive" : "outline"}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim() || isRecording || isTranscribing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}