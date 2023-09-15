import { v } from 'convex/values';
import { UserDto } from './../src/app/types/index';
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
  async handler(ctx, args): Promise<UserDto | 'USER_NOT_FOUND'> {
    const user = await userQuery(ctx, args.clerkUserId);

    if (user === null) {
      return 'USER_NOT_FOUND';
    }

    return {
      _id: user._id,
      _creationTime: user._creationTime,
      clerkUsername: user.clerkUser.username,
      clerkImageUrl: user.clerkUser.image_url,
      clerkUserId: user.clerkUser.id,
    };
  },
});

export const getUserById = query({
  args: { id: v.id('users') },
  async handler(ctx, args): Promise<UserDto | 'USER_NOT_FOUND'> {
    const user = await ctx.db.get(args.id);

    if (user === null) {
      return 'USER_NOT_FOUND';
    }

    return {
      _id: user._id,
      _creationTime: user._creationTime,
      clerkUsername: user.clerkUser.username,
      clerkImageUrl: user.clerkUser.image_url,
      clerkUserId: user.clerkUser.id,
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

    const userLikes = await ctx.db
      .query('likes')
      .withIndex('by_user_post_id', q => q.eq('userId', userRecord._id))
      .collect();

    const userFollowers = await ctx.db
      .query('follows')
      .withIndex('by_following', q => q.eq('following', userRecord._id))
      .collect();
    const userFollowings = await ctx.db
      .query('follows')
      .withIndex('by_follower', q => q.eq('follower', userRecord._id))
      .collect();

    await Promise.all(
      userPosts.map(async post => await ctx.db.delete(post._id))
    );

    await Promise.all(
      userLikes.map(async like => await ctx.db.delete(like._id))
    );

    await Promise.all(
      userFollowers.map(async follower => await ctx.db.delete(follower._id))
    );

    await Promise.all(
      userFollowings.map(async following => await ctx.db.delete(following._id))
    );

    await ctx.db.delete(userRecord._id);
  },
});
