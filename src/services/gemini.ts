export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey || this.apiKey === 'demo_gemini_key') {
      console.warn('Gemini API key not configured. AI features will be limited.');
    }
  }

  async generateContent(prompt: string): Promise<string> {
    if (!this.apiKey || this.apiKey === 'demo_gemini_key') {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
    }

    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result: GeminiResponse = await response.json();
      
      if (result.candidates && result.candidates[0]?.content?.parts?.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response generated');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  async generateStatusUpdate(projectData: any): Promise<string> {
    const prompt = `Generate a professional status update for this project: ${JSON.stringify(projectData, null, 2)}`;
    return this.generateContent(prompt);
  }

  async generateInsights(journalEntries: any[]): Promise<string> {
    const prompt = `Analyze these journal entries and provide key insights: ${JSON.stringify(journalEntries, null, 2)}`;
    return this.generateContent(prompt);
  }

  async generateOnboardingGuide(userGoals: string): Promise<string> {
    const prompt = `Create a personalized onboarding guide for a user with these goals: ${userGoals}`;
    return this.generateContent(prompt);
  }
}

export const geminiService = new GeminiService();
