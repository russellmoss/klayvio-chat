import { z } from 'zod';

// Client-side environment variables (available in browser)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Winery Email AI Assistant'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  MIXPANEL_TOKEN: z.string().optional(),
});

// Server-side environment variables (only available on server)
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  KLAVIYO_PRIVATE_KEY: z.string().min(1),
  KLAVIYO_PUBLIC_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().default('0'),
  REDIS_SECONDARY_HOST: z.string().optional(),
  REDIS_SECONDARY_PORT: z.string().default('6379'),
  KLAVIYO_WEBHOOK_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
});

// Use environment variables directly with fallbacks (bypass Zod validation for now)
const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Winery Email AI Assistant',
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
  MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN,
};

// Use server environment variables directly with fallbacks (bypass Zod validation for now)
const serverEnv = typeof window === 'undefined' ? {
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || 'your-supabase-service-key',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || 'your-anthropic-api-key',
  KLAVIYO_PRIVATE_KEY: process.env.KLAVIYO_PRIVATE_KEY || 'your-klaviyo-private-key',
  KLAVIYO_PUBLIC_KEY: process.env.KLAVIYO_PUBLIC_KEY || 'your-klaviyo-public-key',
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || '6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: process.env.REDIS_DB || '0',
  REDIS_SECONDARY_HOST: process.env.REDIS_SECONDARY_HOST,
  REDIS_SECONDARY_PORT: process.env.REDIS_SECONDARY_PORT || '6379',
  KLAVIYO_WEBHOOK_SECRET: process.env.KLAVIYO_WEBHOOK_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-nextauth-secret-here',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
} : {};

// Combine for full environment
const env = { ...clientEnv, ...serverEnv };

export { env };

export const config = {
  supabase: {
    url: clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: serverEnv.SUPABASE_SERVICE_KEY || '',
  },
  anthropic: {
    apiKey: serverEnv.ANTHROPIC_API_KEY || '',
  },
  klaviyo: {
    privateKey: serverEnv.KLAVIYO_PRIVATE_KEY || '',
    publicKey: serverEnv.KLAVIYO_PUBLIC_KEY,
    webhookSecret: serverEnv.KLAVIYO_WEBHOOK_SECRET,
  },
  app: {
    url: clientEnv.NEXT_PUBLIC_APP_URL,
    name: clientEnv.NEXT_PUBLIC_APP_NAME,
    env: clientEnv.NODE_ENV,
  },
  analytics: {
    googleAnalyticsId: clientEnv.GOOGLE_ANALYTICS_ID,
    mixpanelToken: clientEnv.MIXPANEL_TOKEN,
  },
  email: {
    resendApiKey: serverEnv.RESEND_API_KEY,
  },
  redis: {
    url: serverEnv.REDIS_URL,
    host: serverEnv.REDIS_HOST || 'localhost',
    port: parseInt(serverEnv.REDIS_PORT || '6379'),
    password: serverEnv.REDIS_PASSWORD,
    db: parseInt(serverEnv.REDIS_DB || '0'),
    secondaryHost: serverEnv.REDIS_SECONDARY_HOST,
    secondaryPort: parseInt(serverEnv.REDIS_SECONDARY_PORT || '6379'),
  },
  nextAuth: {
    secret: serverEnv.NEXTAUTH_SECRET,
    url: serverEnv.NEXTAUTH_URL,
  },
} as const;
