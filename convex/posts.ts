import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { PostWithUserDto } from '../src/app/types';
import { Id } from './_generated/dataModel';
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
      .filter(q => q.eq(q.field('parentPostId'), undefined))
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
  handler: async (
    ctx,
    args
  ): Promise<
    PostWithUserDto | 'POST_NOT_FOUND' | 'USER_FOR_POST_NOT_FOUND'
  > => {
    const post = await ctx.db.get(args.id);

    if (post === null) {
      return 'POST_NOT_FOUND';
    }

    const user = await ctx.db.get(post.userId);

    if (user === null) {
      return 'USER_FOR_POST_NOT_FOUND';
    }

    return {
      ...post,
      user: {
        _id: user._id,
        _creationTime: user._creationTime,
        clerkUsername: user.clerkUser.username,
        clerkImageUrl: user.clerkUser.image_url,
        clerkUserId: user.clerkUser.id,
      },
    };
  },
});

export const getRepliesByParentId = query({
  args: { id: v.id('posts'), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query('posts')
      .withIndex('by_parent_id', q => q.eq('parentPostId', args.id))
      .order('desc')
      .paginate(args.paginationOpts);

    const repliesWithUserData = await Promise.all(
      replies.page.map(async reply => {
        const user = await ctx.db.get(reply.userId);

        if (user === null) {
          return {
            ...reply,
            user: {
              _id: '' as Id<'users'>,
              _creationTime: 0,
              clerkUsername: null,
              clerkImageUrl: '',
              clerkUserId: '',
            },
          };
        }

        return {
          ...reply,
          user: {
            _id: user._id,
            _creationTime: user._creationTime,
            clerkUsername: user.clerkUser.username,
            clerkImageUrl: user.clerkUser.image_url,
            clerkUserId: user.clerkUser.id,
          },
        };
      })
    );

    return { ...replies, page: repliesWithUserData };
  },
});

export const getPostReplyCount = query({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query('posts')
      .withIndex('by_parent_id', q => q.eq('parentPostId', args.postId))
      .collect();

    return replies.length;
  },
});

export const getUserPostCount = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query('posts')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .collect();

    return posts.length;
  },
});
