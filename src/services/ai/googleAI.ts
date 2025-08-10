import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export class GoogleAIService {
  private model: ChatGoogleGenerativeAI;

  constructor() {
    // This will need the Google AI Studio API key from Supabase secrets
    this.model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
      temperature: 0.7,
      apiKey: "GOOGLE_AI_STUDIO_API_KEY", // Will be replaced with actual secret
    });
  }

  async generateResponse(message: string, context?: string): Promise<string> {
    try {
      const prompt = context 
        ? `Contexto: ${context}\n\nPergunta do usuário: ${message}`
        : message;

      const response = await this.model.invoke(prompt);
      return response.content as string;
    } catch (error) {
      console.error('Erro no Google AI:', error);
      return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
    }
  }

  async analyzeData(data: any, query: string): Promise<string> {
    try {
      const prompt = `
        Você é um assistente especializado em análise de dados de dashboard.
        
        Dados para análise: ${JSON.stringify(data)}
        
        Pergunta do usuário: ${query}
        
        Por favor, analise os dados e forneça insights úteis, tendências ou recomendações baseadas na pergunta.
        Seja conciso mas informativo. Responda em português.
      `;

      const response = await this.model.invoke(prompt);
      return response.content as string;
    } catch (error) {
      console.error('Erro na análise de dados:', error);
      return 'Não foi possível analisar os dados no momento.';
    }
  }
}

export const googleAI = new GoogleAIService();