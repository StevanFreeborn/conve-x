import { auth } from '@clerk/nextjs';
import { ConvexHttpClient } from 'convex/browser';

export async function getConvexClient() {
  const { user, getToken } = auth();
  const token = await getToken({ template: 'convex' });

  if (token === null || user === null) {
    throw new Error('NOT_AUTHORIZED');
  }

  const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (CONVEX_URL === undefined) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL is undefined');
  }

  const client = new ConvexHttpClient(CONVEX_URL);
  client.setAuth(token);

  return client;
}
