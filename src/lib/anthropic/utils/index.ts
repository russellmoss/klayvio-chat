import { AnalysisContext } from '../client';

// Text Processing Utilities
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const extractKeyInsights = (response: string): string[] => {
  const insights: string[] = [];
  const lines = response.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^\d+\./) || trimmed.startsWith('-') || trimmed.startsWith('•')) {
      insights.push(trimmed);
    }
  }
  
  return insights;
};

export const formatResponseForDisplay = (response: string): string => {
  // Convert markdown-style formatting to HTML-friendly format
  return response
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
};

// Context Building Utilities
export const buildAnalysisContext = (
  metrics?: Record<string, unknown>,
  userQuery?: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>
): AnalysisContext => {
  return {
    metrics,
    userQuery,
    conversationHistory,
  };
};

export const extractContextFromQuery = (query: string): Partial<AnalysisContext> => {
  const context: Partial<AnalysisContext> = {};
  
  // Extract wine-related keywords
  const wineKeywords = ['wine', 'vintage', 'varietal', 'winery', 'tasting', 'sommelier'];
  const hasWineContext = wineKeywords.some(keyword => 
    query.toLowerCase().includes(keyword)
  );
  
  if (hasWineContext) {
    context.userQuery = query;
  }
  
  return context;
};

// Response Analysis Utilities
export const analyzeResponseQuality = (response: string): {
  completeness: number;
  actionability: number;
  wineIndustryRelevance: number;
  overall: number;
} => {
  const wineIndustryTerms = [
    'wine', 'winery', 'vintage', 'varietal', 'tasting', 'sommelier',
    'grape', 'vineyard', 'cellar', 'cork', 'bouquet', 'terroir'
  ];
  
  const actionableTerms = [
    'recommend', 'suggest', 'implement', 'optimize', 'improve',
    'strategy', 'tactic', 'approach', 'solution', 'action'
  ];
  
  const wineIndustryRelevance = wineIndustryTerms.reduce((score, term) => {
    return score + (response.toLowerCase().includes(term) ? 1 : 0);
  }, 0) / wineIndustryTerms.length;
  
  const actionability = actionableTerms.reduce((score, term) => {
    return score + (response.toLowerCase().includes(term) ? 1 : 0);
  }, 0) / actionableTerms.length;
  
  const completeness = Math.min(response.length / 500, 1); // Assume 500 chars is complete
  
  const overall = (wineIndustryRelevance + actionability + completeness) / 3;
  
  return {
    completeness,
    actionability,
    wineIndustryRelevance,
    overall,
  };
};

export const extractRecommendations = (response: string): string[] => {
  const recommendations: string[] = [];
  const lines = response.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().includes('recommend') || 
        trimmed.toLowerCase().includes('suggest') ||
        trimmed.toLowerCase().includes('consider')) {
      recommendations.push(trimmed);
    }
  }
  
  return recommendations;
};

export const extractMetrics = (response: string): Array<{
  metric: string;
  value: string;
  context: string;
}> => {
  const metrics: Array<{ metric: string; value: string; context: string }> = [];
  
  // Look for percentage patterns
  const percentagePattern = /(\d+(?:\.\d+)?%)/g;
  const percentageMatches = response.match(percentagePattern);
  
  if (percentageMatches) {
    percentageMatches.forEach(match => {
      const context = response.substring(
        Math.max(0, response.indexOf(match) - 50),
        response.indexOf(match) + match.length + 50
      );
      
      metrics.push({
        metric: 'percentage',
        value: match,
        context: context.trim(),
      });
    });
  }
  
  // Look for currency patterns
  const currencyPattern = /\$[\d,]+(?:\.\d{2})?/g;
  const currencyMatches = response.match(currencyPattern);
  
  if (currencyMatches) {
    currencyMatches.forEach(match => {
      const context = response.substring(
        Math.max(0, response.indexOf(match) - 50),
        response.indexOf(match) + match.length + 50
      );
      
      metrics.push({
        metric: 'currency',
        value: match,
        context: context.trim(),
      });
    });
  }
  
  return metrics;
};

// Prompt Engineering Utilities
export const enhancePromptWithContext = (
  basePrompt: string,
  context: AnalysisContext
): string => {
  let enhancedPrompt = basePrompt;
  
  if (context.metrics) {
    enhancedPrompt += `\n\nCurrent Metrics Context:\n${JSON.stringify(context.metrics, null, 2)}`;
  }
  
  if (context.userQuery) {
    enhancedPrompt += `\n\nUser Query: ${context.userQuery}`;
  }
  
  if (context.conversationHistory && context.conversationHistory.length > 0) {
    enhancedPrompt += `\n\nPrevious Conversation Context:`;
    context.conversationHistory.slice(-3).forEach(msg => {
      enhancedPrompt += `\n${msg.role}: ${msg.content}`;
    });
  }
  
  return enhancedPrompt;
};

export const addWineIndustryContext = (prompt: string): string => {
  const wineIndustryContext = `
    
    Wine Industry Context:
    - Focus on wine industry best practices and customer engagement
    - Consider seasonal factors and wine industry trends
    - Emphasize wine education and customer experience
    - Include wine-specific terminology and concepts
    - Address wine industry customer lifecycle and retention
  `;
  
  return prompt + wineIndustryContext;
};

// Response Validation Utilities
export const validateResponse = (response: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for minimum length
  if (response.length < 50) {
    errors.push('Response is too short');
  }
  
  // Check for wine industry relevance
  const wineTerms = ['wine', 'winery', 'vintage', 'varietal', 'tasting'];
  const hasWineTerms = wineTerms.some(term => 
    response.toLowerCase().includes(term)
  );
  
  if (!hasWineTerms) {
    warnings.push('Response may lack wine industry context');
  }
  
  // Check for actionable content
  const actionableTerms = ['recommend', 'suggest', 'implement', 'optimize'];
  const hasActionableContent = actionableTerms.some(term => 
    response.toLowerCase().includes(term)
  );
  
  if (!hasActionableContent) {
    warnings.push('Response may lack actionable recommendations');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Performance Utilities
export const measureResponseTime = async <T>(
  operation: () => Promise<T>
): Promise<{ result: T; duration: number }> => {
  const startTime = Date.now();
  const result = await operation();
  const duration = Date.now() - startTime;
  
  return { result, duration };
};

export const estimateTokenCount = (text: string): number => {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
};

export const optimizePromptLength = (prompt: string, maxTokens: number = 4000): string => {
  const estimatedTokens = estimateTokenCount(prompt);
  
  if (estimatedTokens <= maxTokens) {
    return prompt;
  }
  
  // Truncate to fit within token limit
  const maxLength = maxTokens * 4; // 4 characters per token
  return prompt.substring(0, maxLength).trim() + '...';
};

// Wine Industry Specific Utilities
export const extractWineVarietals = (text: string): string[] => {
  const commonVarietals = [
    'Cabernet Sauvignon', 'Chardonnay', 'Pinot Noir', 'Merlot', 'Sauvignon Blanc',
    'Syrah', 'Riesling', 'Zinfandel', 'Pinot Grigio', 'Malbec', 'Sangiovese',
    'Tempranillo', 'Gewürztraminer', 'Viognier', 'Nebbiolo', 'Barbera'
  ];
  
  const foundVarietals: string[] = [];
  
  commonVarietals.forEach(varietal => {
    if (text.toLowerCase().includes(varietal.toLowerCase())) {
      foundVarietals.push(varietal);
    }
  });
  
  return foundVarietals;
};

export const extractWineRegions = (text: string): string[] => {
  const commonRegions = [
    'Napa Valley', 'Sonoma', 'Bordeaux', 'Burgundy', 'Tuscany', 'Rioja',
    'Barossa Valley', 'Marlborough', 'Champagne', 'Piedmont', 'Rhône',
    'Mosel', 'Douro', 'Mendoza', 'Central Coast', 'Willamette Valley'
  ];
  
  const foundRegions: string[] = [];
  
  commonRegions.forEach(region => {
    if (text.toLowerCase().includes(region.toLowerCase())) {
      foundRegions.push(region);
    }
  });
  
  return foundRegions;
};

export const extractSeasonalContext = (text: string): string | null => {
  const seasons = ['spring', 'summer', 'fall', 'autumn', 'winter'];
  const holidays = ['christmas', 'thanksgiving', 'valentine', 'easter', 'halloween'];
  
  const lowerText = text.toLowerCase();
  
  for (const season of seasons) {
    if (lowerText.includes(season)) {
      return season;
    }
  }
  
  for (const holiday of holidays) {
    if (lowerText.includes(holiday)) {
      return holiday;
    }
  }
  
  return null;
};

// All exports are already declared above
