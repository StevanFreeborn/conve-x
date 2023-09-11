import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
export default defineSchema(
  {
    users: defineTable({
      clerkUser: v.any(),
    }).index('by_clerk_id', ['clerkUser.id']),
    posts: defineTable({
      parentPostId: v.optional(v.id('posts')),
      userId: v.id('users'),
      content: v.array(v.string()),
    }).index('by_user_id', ['userId']),
  },
  { schemaValidation: false }
);
