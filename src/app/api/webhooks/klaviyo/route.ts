import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { KlaviyoWebhookHandler } from '@/lib/webhooks/klaviyo';
import { webhookQueue } from '@/lib/queue/processor';

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const signature = headersList.get('x-klaviyo-signature');
    const body = await request.text();

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Initialize webhook handler
    const webhookHandler = new KlaviyoWebhookHandler();

    // Verify webhook signature
    const isValid = webhookHandler.verifySignature(body, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const events = webhookHandler.parseWebhookPayload(body);
    
    // Process each event
    for (const event of events) {
      // Check for duplicates
      if (webhookHandler.isDuplicateEvent(event.id)) {
        console.log(`Skipping duplicate event: ${event.id}`);
        continue;
      }

      // Add to processing queue
      await webhookQueue.add('process-webhook', {
        event,
        timestamp: new Date().toISOString(),
      });

      // Mark event as processed
      webhookHandler.markEventProcessed(event.id);
    }

    return NextResponse.json({
      success: true,
      processed: events.length,
      message: 'Webhook events queued for processing',
    });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({
    success: true,
    message: 'Klaviyo webhook endpoint is healthy',
    timestamp: new Date().toISOString(),
  });
}
