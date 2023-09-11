import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { userQuery } from './users';

export const createPost = mutation({
  args: {
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
