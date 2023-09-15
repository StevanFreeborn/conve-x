import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { userQuery } from './users';

export const addLike = mutation({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const clerkUser = await ctx.auth.getUserIdentity();

    if (clerkUser === null) {
      return;
    }

    const user = await userQuery(ctx, clerkUser.subject);

    if (user === null) {
      return;
    }

    const existingLike = await ctx.db
      .query('likes')
      .withIndex('by_user_post_id', q =>
        q.eq('userId', user._id).eq('postId', args.postId)
      )
      .unique();

    if (existingLike !== null) {
      return;
    }

    await ctx.db.insert('likes', { postId: args.postId, userId: user._id });
  },
});

export const removeLike = mutation({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const clerkUser = await ctx.auth.getUserIdentity();

    if (clerkUser === null) {
      return;
    }

    const user = await userQuery(ctx, clerkUser.subject);

    if (user === null) {
      return;
    }

    const existingLike = await ctx.db
      .query('likes')
      .withIndex('by_user_post_id', q =>
        q.eq('userId', user._id).eq('postId', args.postId)
      )
      .unique();

    if (existingLike === null) {
      return;
    }

    await ctx.db.delete(existingLike._id);
  },
});

export const getLike = query({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const clerkUser = await ctx.auth.getUserIdentity();

    if (clerkUser === null) {
      return;
    }

    const user = await userQuery(ctx, clerkUser.subject);

    if (user === null) {
      return;
    }

    return await ctx.db
      .query('likes')
      .withIndex('by_post_user_id', q =>
        q.eq('postId', args.postId).eq('userId', user._id)
      )
      .unique();
  },
});

export const getPostLikeCount = query({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query('likes')
      .withIndex('by_post_user_id', q => q.eq('postId', args.postId))
      .collect();

    return likes.length;
  },
});
