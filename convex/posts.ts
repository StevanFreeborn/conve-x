import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { userQuery } from './users';

export const createOrUpdatePost = mutation({
  args: {
    id: v.optional(v.id('posts')),
    clerkUserId: v.string(),
    content: v.array(v.string()),
    parentPostId: v.optional(v.id('posts')),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    const user = await userQuery(ctx, args.clerkUserId);

    if (userIdentity === null) {
      return 'USER_NOT_AUTHORIZED';
    }

    if (user === null) {
      return 'USER_NOT_FOUND';
    }

    if (userIdentity.subject !== args.clerkUserId) {
      return 'CANNOT_POST_ON_BEHALF_OF_ANOTHER_USER';
    }

    if (args.id) {
      await ctx.db.patch(args.id, { content: args.content });
      return;
    }

    return await ctx.db.insert('posts', {
      userId: user._id,
      content: args.content,
      parentPostId: args.parentPostId,
    });
  },
});

export const getUsersPostById = query({
  args: { userId: v.id('users'), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('posts')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .order('desc')
      .paginate(args.paginationOpts);
  },
});

export const deletePostById = mutation({
  args: { id: v.id('posts') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getPostById = query({
  args: { id: v.id('posts') },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);

    if (post === null) {
      return 'POST_NOT_FOUND';
    }

    return post;
  },
});
