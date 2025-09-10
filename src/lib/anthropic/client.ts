import Anthropic from '@anthropic-ai/sdk';
import { config } from '@/lib/env';
import { KlaviyoMetrics, WineryMetrics, WineClubMetrics, CustomerInsights } from '@/lib/klaviyo/types';

export interface ClaudeResponse {
  content: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  model: string;
}

export interface AnalysisContext {
  metrics?: KlaviyoMetrics;
  wineryMetrics?: WineryMetrics;
  wineClubMetrics?: WineClubMetrics;
  customerInsights?: CustomerInsights;
  userQuery?: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

export class ClaudeClient {
  private client: Anthropic;
  private conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }> = [];

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropic.apiKey,
    });
  }

  async generateResponse(
    prompt: string,
    context?: AnalysisContext,
    maxTokens: number = 4000
  ): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
          ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const responseText = content.text;
        
        // Add to conversation history
        this.conversationHistory.push({
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString(),
        });
        
        this.conversationHistory.push({
          role: 'assistant',
          content: responseText,
          timestamp: new Date().toISOString(),
        });

        return responseText;
      }

      throw new Error('Unexpected response format from Claude');
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeEmailPerformance(
    campaignData: any,
    context?: AnalysisContext
  ): Promise<string> {
    const prompt = `
      Analyze the following email campaign performance data for a winery:
      
      Campaign Data: ${JSON.stringify(campaignData, null, 2)}
      
      Please provide:
      1. Performance summary (open rates, click rates, conversions)
      2. Key insights and trends
      3. Recommendations for improvement
      4. Wine industry specific insights
      5. Actionable next steps
      
      Focus on wine industry best practices and customer engagement strategies.
    `;

    return this.generateResponse(prompt, context);
  }

  async generateEmailStrategy(
    targetAudience: string,
    campaignGoal: string,
    context?: AnalysisContext
  ): Promise<string> {
    const prompt = `
      Create an email marketing strategy for a winery targeting: ${targetAudience}
      Campaign Goal: ${campaignGoal}
      
      Please provide:
      1. Campaign theme and messaging approach
      2. Email sequence structure
      3. Content recommendations
      4. Timing and frequency suggestions
      5. Wine industry specific considerations
      6. Personalization strategies
      7. Call-to-action recommendations
      
      Make it specific to wine industry marketing and customer engagement.
    `;

    return this.generateResponse(prompt, context);
  }

  async getCampaignContentSuggestions(
    campaignType: string,
    wineVarietals: string[],
    season: string,
    context?: AnalysisContext
  ): Promise<string> {
    const prompt = `
      Generate email content suggestions for a ${campaignType} campaign featuring:
      Wine Varietals: ${wineVarietals.join(', ')}
      Season: ${season}
      
      Please provide:
      1. Subject line options (5-7 variations)
      2. Email body content structure
      3. Wine pairing suggestions
      4. Seasonal messaging themes
      5. Visual content recommendations
      6. Personalization elements
      7. Wine education content ideas
      
      Make it engaging and educational for wine enthusiasts.
    `;

    return this.generateResponse(prompt, context);
  }

  async getSubjectLineOptimization(
    currentSubjectLines: string[],
    campaignType: string,
    context?: AnalysisContext
  ): Promise<string> {
    const prompt = `
      Optimize these email subject lines for a ${campaignType} campaign:
      
      Current Subject Lines:
      ${currentSubjectLines.map((line, index) => `${index + 1}. ${line}`).join('\n')}
      
      Please provide:
      1. Analysis of current subject lines
      2. Improved versions with explanations
      3. A/B testing recommendations
      4. Wine industry specific best practices
      5. Emotional triggers and urgency techniques
      6. Personalization opportunities
      
      Focus on wine industry engagement and conversion optimization.
    `;

    return this.generateResponse(prompt, context);
  }

  async getSeasonalCampaignIdeas(
    season: string,
    wineInventory: string[],
    context?: AnalysisContext
  ): Promise<string> {
    const prompt = `
      Generate seasonal campaign ideas for ${season} featuring these wines:
      ${wineInventory.join(', ')}
      
      Please provide:
      1. Seasonal theme concepts
      2. Wine pairing suggestions
      3. Event and experience ideas
      4. Educational content themes
      5. Customer engagement strategies
      6. Special offers and promotions
      7. Cross-selling opportunities
      
      Make it relevant to ${season} and wine industry trends.
    `;

    return this.generateResponse(prompt, context);
  }

  async analyzeCustomerBehavior(
    customerData: any,
    context?: AnalysisContext
  ): Promise<string> {
    const prompt = `
      Analyze this customer behavior data for wine industry insights:
      
      Customer Data: ${JSON.stringify(customerData, null, 2)}
      
      Please provide:
      1. Customer segmentation insights
      2. Purchase behavior patterns
      3. Wine preference analysis
      4. Engagement level assessment
      5. Retention opportunities
      6. Upselling potential
      7. Personalized marketing recommendations
      
      Focus on wine industry customer lifecycle and engagement strategies.
    `;

    return this.generateResponse(prompt, context);
  }

  async generateWineEducationContent(
    topic: string,
    targetAudience: string,
    context?: AnalysisContext
  ): Promise<string> {
    const prompt = `
      Create educational content about ${topic} for ${targetAudience}:
      
      Please provide:
      1. Educational content structure
      2. Key learning points
      3. Wine industry terminology explanations
      4. Practical applications
      5. Visual content suggestions
      6. Interactive elements
      7. Follow-up content ideas
      
      Make it accessible and engaging for wine enthusiasts of all levels.
    `;

    return this.generateResponse(prompt, context);
  }

  async getPersonalizationRecommendations(
    customerProfile: any,
    context?: AnalysisContext
  ): Promise<string> {
    const prompt = `
      Provide personalization recommendations for this customer profile:
      
      Customer Profile: ${JSON.stringify(customerProfile, null, 2)}
      
      Please provide:
      1. Personalization opportunities
      2. Content customization suggestions
      3. Product recommendations
      4. Communication preferences
      5. Timing optimization
      6. Channel preferences
      7. Loyalty program engagement
      
      Focus on wine industry personalization and customer experience.
    `;

    return this.generateResponse(prompt, context);
  }

  async analyzeMarketTrends(
    marketData: any,
    context?: AnalysisContext
  ): Promise<string> {
    const prompt = `
      Analyze these wine market trends and provide insights:
      
      Market Data: ${JSON.stringify(marketData, null, 2)}
      
      Please provide:
      1. Key market trends
      2. Consumer behavior shifts
      3. Wine category performance
      4. Seasonal patterns
      5. Competitive landscape insights
      6. Growth opportunities
      7. Strategic recommendations
      
      Focus on wine industry market dynamics and business opportunities.
    `;

    return this.generateResponse(prompt, context);
  }

  async generateReportInsights(
    reportData: any,
    reportType: string,
    context?: AnalysisContext
  ): Promise<string> {
    const prompt = `
      Generate insights from this ${reportType} report:
      
      Report Data: ${JSON.stringify(reportData, null, 2)}
      
      Please provide:
      1. Executive summary
      2. Key performance indicators
      3. Trend analysis
      4. Comparative insights
      5. Actionable recommendations
      6. Risk assessment
      7. Future outlook
      
      Make it relevant to wine industry business intelligence and decision-making.
    `;

    return this.generateResponse(prompt, context);
  }

  private buildSystemPrompt(context?: AnalysisContext): string {
    const basePrompt = `
      You are Claude, an AI assistant specialized in wine industry email marketing and customer engagement. 
      You have deep expertise in:
      
      - Wine industry trends and consumer behavior
      - Email marketing best practices for wineries
      - Customer relationship management in the wine industry
      - Wine education and content marketing
      - Seasonal marketing strategies
      - Wine club management and retention
      - E-commerce optimization for wine sales
      
      You provide actionable, data-driven insights and recommendations specifically tailored to wineries and wine businesses.
      Always consider wine industry context, customer preferences, and business objectives in your responses.
      
      Key principles:
      - Focus on wine industry best practices
      - Provide specific, actionable recommendations
      - Consider seasonal and regional factors
      - Emphasize customer education and engagement
      - Support business growth and customer retention
      - Use wine industry terminology appropriately
    `;

    if (context?.metrics) {
      return `${basePrompt}
      
      Current Context:
      - You have access to Klaviyo email marketing metrics
      - Consider this data when providing recommendations
      - Reference specific metrics when relevant
      `;
    }

    if (context?.conversationHistory) {
      return `${basePrompt}
      
      Conversation Context:
      - You have access to previous conversation history
      - Maintain consistency with previous recommendations
      - Build upon previous insights and suggestions
      `;
    }

    return basePrompt;
  }

  // Utility methods
  clearConversationHistory(): void {
    this.conversationHistory = [];
  }

  getConversationHistory(): Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }> {
    return [...this.conversationHistory];
  }

  addToConversationHistory(
    role: 'user' | 'assistant',
    content: string
  ): void {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const claudeClient = new ClaudeClient();
