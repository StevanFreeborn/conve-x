import type { WebhookEvent } from '@clerk/backend';
import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

async function validateRequest(
  req: Request
): Promise<WebhookEvent | undefined> {
  const payloadString = await req.text();

  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  };

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (webhookSecret === undefined) {
    throw Error('CLERK_WEBHOOK_SECRET is undefined');
  }

  const wh = new Webhook(webhookSecret);

  let evt: Event | null = null;

  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (error) {
    console.log(error);
    return;
  }

  return evt as unknown as WebhookEvent;
}

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response('Error occurred', {
      status: 400,
    });
  }
  switch (event.type) {
    case 'user.created':
    case 'user.updated': {
      const existingUser = await ctx.runQuery(internal.users.getUser, {
        subject: event.data.id,
      });

      if (existingUser && event.type === 'user.created') {
        console.warn('Overwriting user', event.data.id, 'with', event.data);
      }

      console.log('creating/updating user', event.data.id);

      await ctx.runMutation(internal.users.updateOrCreateUser, {
        clerkUser: event.data,
      });

      break;
    }
    case 'user.deleted': {
      const id = event.data.id!;
      await ctx.runMutation(internal.users.deleteUser, { id });
      break;
    }
    default: {
      console.log('ignored Clerk webhook event', event.type);
    }
  }
  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: handleClerkWebhook,
});

export default http;
