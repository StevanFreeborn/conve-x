import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { PostWithUserDto } from '../src/app/types';
import { Doc } from './_generated/dataModel.d';
import { QueryCtx, mutation, query } from './_generated/server';
import { createUserDto, userQuery } from './users';

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

    const contentText = args.content.join('\n');

    if (args.id) {
      await ctx.db.patch(args.id, { content: args.content, contentText });
      return;
    }

    return await ctx.db.insert('posts', {
      userId: user._id,
      content: args.content,
      parentPostId: args.parentPostId,
      contentText,
    });
  },
});

export const getUsersPostById = query({
  args: { userId: v.id('users'), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query('posts')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .filter(q => q.eq(q.field('parentPostId'), undefined))
      .order('desc')
      .paginate(args.paginationOpts);

    const postDtos = posts.page.map(createPostDto);

    return { ...posts, page: postDtos };
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
      ...createPostDto(post),
      user: createUserDto(user),
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

    const repliesWithUserData = await getPostsWithUsers({
      ctx,
      posts: replies.page,
    });

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
      .filter(q => q.eq(q.field('parentPostId'), undefined))
      .collect();

    return posts.length;
  },
});

export const getAllPostsWithUser = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query('posts')
      .filter(q => q.eq(q.field('parentPostId'), undefined))
      .order('desc')
      .paginate(args.paginationOpts);

    const postsWithUser = await getPostsWithUsers({ ctx, posts: posts.page });

    return { ...posts, page: postsWithUser };
  },
});

export const getAllPostsForFollowings = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const currentUser = await ctx.auth.getUserIdentity();

    if (currentUser === null) {
      return { isDone: true, continueCursor: '', page: [] };
    }

    const user = await userQuery(ctx, currentUser.subject);

    if (user === null) {
      return { isDone: true, continueCursor: '', page: [] };
    }

    const followings = await ctx.db
      .query('follows')
      .withIndex('by_follower', q => q.eq('follower', user._id))
      .collect();

    const posts = await ctx.db
      .query('posts')
      .filter(q =>
        q.and(
          q.or(
            ...followings.map(following =>
              q.eq(q.field('userId'), following.following)
            )
          ),
          q.eq(q.field('parentPostId'), undefined)
        )
      )
      .order('desc')
      .paginate(args.paginationOpts);

    const postsWithUser = await getPostsWithUsers({ ctx, posts: posts.page });

    return { ...posts, page: postsWithUser };
  },
});

export const getPostsBySearchTerm = query({
  args: { term: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query('posts')
      .withSearchIndex('search_by_content', q =>
        q.search('contentText', args.term)
      )
      .paginate(args.paginationOpts);

    const postsWithUser = await getPostsWithUsers({ ctx, posts: posts.page });

    return { ...posts, page: postsWithUser };
  },
});

async function getPostsWithUsers({
  ctx,
  posts,
}: {
  ctx: QueryCtx;
  posts: Doc<'posts'>[];
}) {
  return await Promise.all(
    posts.map(async post => {
      const postDto = createPostDto(post);
      const user = await ctx.db.get(post.userId);

      if (user === null) {
        return {
          ...postDto,
          user: createUserDto(user),
        };
      }

      return {
        ...postDto,
        user: createUserDto(user),
      };
    })
  );
}

function createPostDto(post: Doc<'posts'>) {
  const { contentText, ...postDto } = post;
  return postDto;
}
