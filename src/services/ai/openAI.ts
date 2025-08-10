import OpenAI from 'openai';

export class OpenAIVoiceService {
  private client: OpenAI;

  constructor() {
    // This will need the OpenAI API key from Supabase secrets
    this.client = new OpenAI({
      apiKey: "OPENAI_API_KEY", // Will be replaced with actual secret
      dangerouslyAllowBrowser: true
    });
  }

  async textToSpeech(text: string, voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'nova'): Promise<string> {
    try {
      const response = await this.client.audio.speech.create({
        model: 'tts-1',
        voice: voice,
        input: text,
        response_format: 'mp3'
      });

      // Convert response to blob URL for audio playback
      const blob = new Blob([await response.arrayBuffer()], { type: 'audio/mpeg' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Erro no TTS OpenAI:', error);
      throw new Error('Falha ao gerar áudio');
    }
  }

  async speechToText(audioBlob: Blob): Promise<string> {
    try {
      const file = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
      
      const response = await this.client.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        language: 'pt'
      });

      return response.text;
    } catch (error) {
      console.error('Erro no STT OpenAI:', error);
      throw new Error('Falha ao transcrever áudio');
    }
  }
}

export const openAIVoice = new OpenAIVoiceService();