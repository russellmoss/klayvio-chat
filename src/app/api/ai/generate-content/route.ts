import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { claudeClient } from '@/lib/anthropic/client';

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contentType, context, options } = await request.json();

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400 }
      );
    }

    let generatedContent;

    switch (contentType) {
      case 'email_subject':
        generatedContent = await generateEmailSubject(context, options);
        break;
      case 'email_body':
        generatedContent = await generateEmailBody(context, options);
        break;
      case 'campaign_idea':
        generatedContent = await generateCampaignIdea(context, options);
        break;
      case 'social_media':
        generatedContent = await generateSocialMediaContent(context, options);
        break;
      case 'product_description':
        generatedContent = await generateProductDescription(context, options);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        contentType,
        content: generatedContent,
        context,
        options,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Content generation failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function generateEmailSubject(context: any, options: any) {
  const prompt = `
    Generate compelling email subject lines for a winery email campaign.
    
    Context: ${JSON.stringify(context)}
    Options: ${JSON.stringify(options)}
    
    Requirements:
    - Wine industry focused
    - Engaging and click-worthy
    - 50 characters or less
    - Include seasonal relevance if applicable
    - Generate 5 different options
    
    Return as JSON array of subject lines.
  `;

  return await claudeClient.generateResponse(prompt, {
    maxTokens: 500,
    systemPrompt: 'You are an expert email marketing copywriter specializing in the wine industry.',
  });
}

async function generateEmailBody(context: any, options: any) {
  const prompt = `
    Generate email body content for a winery email campaign.
    
    Context: ${JSON.stringify(context)}
    Options: ${JSON.stringify(options)}
    
    Requirements:
    - Wine industry expertise
    - Engaging storytelling
    - Clear call-to-action
    - Mobile-friendly formatting
    - Include wine knowledge and passion
    - 200-400 words
    
    Return as HTML formatted content.
  `;

  return await claudeClient.generateResponse(prompt, {
    maxTokens: 1000,
    systemPrompt: 'You are a wine industry expert and email marketing specialist.',
  });
}

async function generateCampaignIdea(context: any, options: any) {
  const prompt = `
    Generate creative campaign ideas for a winery's email marketing.
    
    Context: ${JSON.stringify(context)}
    Options: ${JSON.stringify(options)}
    
    Requirements:
    - Wine industry specific
    - Seasonal relevance
    - Customer engagement focused
    - Revenue generating potential
    - Include campaign name, concept, and key messaging
    
    Return as structured campaign idea with name, concept, target audience, and key messages.
  `;

  return await claudeClient.generateResponse(prompt, {
    maxTokens: 800,
    systemPrompt: 'You are a creative marketing strategist specializing in wine industry campaigns.',
  });
}

async function generateSocialMediaContent(context: any, options: any) {
  const prompt = `
    Generate social media content for a winery.
    
    Context: ${JSON.stringify(context)}
    Options: ${JSON.stringify(options)}
    
    Requirements:
    - Wine industry focused
    - Platform appropriate (Instagram, Facebook, Twitter)
    - Engaging and shareable
    - Include relevant hashtags
    - Wine education and storytelling
    
    Return as platform-specific content with captions and hashtags.
  `;

  return await claudeClient.generateResponse(prompt, {
    maxTokens: 600,
    systemPrompt: 'You are a social media expert specializing in wine industry content.',
  });
}

async function generateProductDescription(context: any, options: any) {
  const prompt = `
    Generate compelling product descriptions for wine products.
    
    Context: ${JSON.stringify(context)}
    Options: ${JSON.stringify(options)}
    
    Requirements:
    - Wine expertise and knowledge
    - Sensory descriptions
    - Food pairing suggestions
    - Winemaking details
    - Customer appeal
    - 100-200 words per wine
    
    Return as structured product descriptions.
  `;

  return await claudeClient.generateResponse(prompt, {
    maxTokens: 800,
    systemPrompt: 'You are a wine sommelier and product description expert.',
  });
}
