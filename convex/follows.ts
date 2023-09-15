import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { userQuery } from './users';

export const addFollow = mutation({
  args: { followingId: v.id('users') },
  handler: async (ctx, args) => {
    const clerkUser = await ctx.auth.getUserIdentity();

    if (clerkUser === null) {
      return;
    }

    const user = await userQuery(ctx, clerkUser.subject);

    if (user === null) {
      return;
    }

    const existingFollow = await ctx.db
      .query('follows')
      .withIndex('by_following_follower_id', q =>
        q.eq('following', args.followingId).eq('follower', user._id)
      )
      .unique();

    if (existingFollow !== null) {
      return;
    }

    await ctx.db.insert('follows', {
      following: args.followingId,
      follower: user._id,
    });
  },
});

export const removeFollow = mutation({
  args: { followingId: v.id('users') },
  handler: async (ctx, args) => {
    const clerkUser = await ctx.auth.getUserIdentity();

    if (clerkUser === null) {
      return;
    }

    const user = await userQuery(ctx, clerkUser.subject);

    if (user === null) {
      return;
    }

    const existingFollow = await ctx.db
      .query('follows')
      .withIndex('by_following_follower_id', q =>
        q.eq('following', args.followingId).eq('follower', user._id)
      )
      .unique();

    if (existingFollow === null) {
      return;
    }

    await ctx.db.delete(existingFollow._id);
  },
});

export const getUserFollowerCount = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query('follows')
      .withIndex('by_following', q => q.eq('following', args.userId))
      .collect();

    return followers.length;
  },
});

export const getUserFollowingCount = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const followings = await ctx.db
      .query('follows')
      .withIndex('by_follower', q => q.eq('follower', args.userId))
      .collect();

    return followings.length;
  },
});

export const getFollowing = query({
  args: { followingId: v.id('users') },
  handler: async (ctx, args) => {
    const currentClerkUser = await ctx.auth.getUserIdentity();

    if (currentClerkUser == null) {
      return false;
    }

    const user = await userQuery(ctx, currentClerkUser.subject);

    if (user == null) {
      return false;
    }

    const following = await ctx.db
      .query('follows')
      .withIndex('by_following_follower_id', q =>
        q.eq('following', args.followingId).eq('follower', user._id)
      )
      .unique();

    return following !== null;
  },
});
