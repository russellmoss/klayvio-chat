// Test API route for basic setup verification
import { NextResponse } from 'next/server';
import { config } from '@/lib/env';

export async function GET() {
  try {
    // Test 1: Environment variables
    const envTest = {
      supabaseUrl: !!config.supabase.url,
      supabaseAnonKey: !!config.supabase.anonKey,
      anthropicApiKey: !!config.anthropic.apiKey,
      klaviyoPrivateKey: !!config.klaviyo.privateKey,
      appUrl: config.app.url,
      appName: config.app.name,
      nodeEnv: config.app.env
    };

    // Test 2: Check if required environment variables are present
    const missingVars = [];
    if (!config.supabase.url) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!config.supabase.anonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    if (!config.anthropic.apiKey) missingVars.push('ANTHROPIC_API_KEY');
    if (!config.klaviyo.privateKey) missingVars.push('KLAVIYO_PRIVATE_KEY');

    // Test 3: File system checks
    const fs = await import('fs');
    const path = await import('path');
    
    const fileChecks = {
      supabaseConfig: fs.existsSync(path.join(process.cwd(), 'supabase', 'config.toml')),
      migrationFile: fs.existsSync(path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql')),
      seedFile: fs.existsSync(path.join(process.cwd(), 'supabase', 'seed', '001_initial_data.sql')),
      typesFile: fs.existsSync(path.join(process.cwd(), 'src', 'types', 'supabase.ts')),
      databaseQueries: fs.existsSync(path.join(process.cwd(), 'src', 'lib', 'database', 'queries.ts'))
    };

    return NextResponse.json({
      success: true,
      message: 'Setup verification completed',
      environment: envTest,
      missingEnvironmentVariables: missingVars,
      fileSystem: fileChecks,
      recommendations: missingVars.length > 0 ? [
        'Set up Supabase project and add environment variables to .env.local',
        'Run database migrations to create tables',
        'Test database connection after setup'
      ] : [
        'Environment variables are configured',
        'Ready to set up Supabase database',
        'Run migrations to create schema'
      ]
    });

  } catch (error) {
    console.error('Setup test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Setup test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
