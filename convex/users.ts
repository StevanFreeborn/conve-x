import { v } from 'convex/values';
import {
  QueryCtx,
  internalMutation,
  internalQuery,
  query,
} from './_generated/server';

export async function userQuery(ctx: QueryCtx, clerkUserId: string) {
  return await ctx.db
    .query('users')
    .withIndex('by_clerk_id', q => q.eq('clerkUser.id', clerkUserId))
    .unique();
}

export const getUserByClerkId = query({
  args: { clerkUserId: v.string() },
  async handler(ctx, args) {
    const user = await userQuery(ctx, args.clerkUserId);

    if (user === null) {
      return 'USER_NOT_FOUND';
    }

    return {
      _id: user._id,
      _creationTime: user._creationTime,
      clerkUsername: user.clerkUser.username,
      clerkImageUrl: user.clerkUser.image_url,
    };
  },
});

export const getUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return await userQuery(ctx, args.subject);
  },
});

export const updateOrCreateUser = internalMutation({
  args: { clerkUser: v.any() },
  async handler(ctx, { clerkUser }) {
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

    const userPosts = await ctx.db
      .query('posts')
      .withIndex('by_user_id', q => q.eq('userId', userRecord._id))
      .collect();

    const userPostDeletePromises = [];

    for (const post of userPosts) {
      userPostDeletePromises.push(ctx.db.delete(post._id));
    }

    await Promise.all(userPostDeletePromises);

    await ctx.db.delete(userRecord._id);
  },
});
