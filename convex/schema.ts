import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkUser: v.any(),
  }).index('by_clerk_id', ['clerkUser.id']),
  posts: defineTable({
    userId: v.id('users'),
    content: v.array(v.string()),
    likes: v.array(v.id('users')),
    replies: v.array(
      v.object({
        userId: v.id('users'),
        content: v.array(v.string()),
      })
    ),
  }),
});
