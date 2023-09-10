import { UserJSON } from '@clerk/nextjs/dist/types/server';
import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { QueryCtx, internalMutation, internalQuery } from './_generated/server';

export const getUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return await userQuery(ctx, args.subject);
  },
});

export async function userQuery(
  ctx: QueryCtx,
  clerkUserId: string
): Promise<(Omit<Doc<'users'>, 'clerkUser'> & { clerkUser: UserJSON }) | null> {
  return await ctx.db
    .query('users')
    .withIndex('by_clerk_id', q => q.eq('clerkUser.id', clerkUserId))
    .unique();
}

export const updateOrCreateUser = internalMutation({
  args: { clerkUser: v.any() },
  async handler(ctx, { clerkUser }: { clerkUser: UserJSON }) {
    const userRecord = await userQuery(ctx, clerkUser.id);

    if (userRecord === null) {
      await ctx.db.insert('users', { clerkUser });
      return;
    }

    await ctx.db.patch(userRecord._id, { clerkUser });
  },
});

export const deleteUser = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const userRecord = await userQuery(ctx, id);

    if (userRecord === null) {
      console.warn("can't delete user, does not exist", id);
      return;
    }

    await ctx.db.delete(userRecord._id);
  },
});
