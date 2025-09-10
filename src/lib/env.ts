import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  KLAVIYO_PRIVATE_KEY: z.string().min(1),
  KLAVIYO_PUBLIC_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Winery Email AI Assistant'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  MIXPANEL_TOKEN: z.string().optional(),
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

const env = envSchema.parse(process.env);

export { env };

export const config = {
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: env.SUPABASE_SERVICE_KEY,
  },
  anthropic: {
    apiKey: env.ANTHROPIC_API_KEY,
  },
  klaviyo: {
    privateKey: env.KLAVIYO_PRIVATE_KEY,
    publicKey: env.KLAVIYO_PUBLIC_KEY,
    webhookSecret: env.KLAVIYO_WEBHOOK_SECRET,
  },
  app: {
    url: env.NEXT_PUBLIC_APP_URL,
    name: env.NEXT_PUBLIC_APP_NAME,
    env: env.NODE_ENV,
  },
  analytics: {
    googleAnalyticsId: env.GOOGLE_ANALYTICS_ID,
    mixpanelToken: env.MIXPANEL_TOKEN,
  },
  email: {
    resendApiKey: env.RESEND_API_KEY,
  },
  redis: {
    url: env.REDIS_URL,
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT),
    password: env.REDIS_PASSWORD,
    db: parseInt(env.REDIS_DB),
    secondaryHost: env.REDIS_SECONDARY_HOST,
    secondaryPort: parseInt(env.REDIS_SECONDARY_PORT),
  },
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
  },
} as const;
