import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
export default defineSchema(
  {
    users: defineTable({
      clerkUser: v.object({
        id: v.string(),
        object: v.string(),
        username: v.union(v.string(), v.null()),
        first_name: v.string(),
        last_name: v.string(),
        gender: v.string(),
        birthday: v.string(),
        profile_image_url: v.string(),
        image_url: v.string(),
        has_image: v.boolean(),
        primary_email_address_id: v.boolean(),
        primary_phone_number_id: v.union(v.string(), v.null()),
        primary_web3_wallet_id: v.union(v.string(), v.null()),
        password_enabled: v.boolean(),
        totp_enabled: v.boolean(),
        backup_code_enabled: v.boolean(),
        two_factor_enabled: v.boolean(),
        banned: v.boolean(),
        email_addresses: v.any(),
        phone_numbers: v.any(),
        web3_wallets: v.any(),
        external_accounts: v.any(),
        external_id: v.union(v.string(), v.null()),
        last_sign_in_at: v.union(v.number(), v.null()),
        public_metadata: v.any(),
        private_metadata: v.any(),
        unsafe_metadata: v.any(),
        created_at: v.number(),
        updated_at: v.number(),
      }),
    })
      .index('by_clerk_id', ['clerkUser.id'])
      .searchIndex('search_by_username', {
        searchField: 'clerkUser.username',
        filterFields: [],
      }),
    posts: defineTable({
      parentPostId: v.optional(v.id('posts')),
      userId: v.id('users'),
      content: v.array(v.string()),
      contentText: v.string(),
    })
      .index('by_user_id', ['userId'])
      .index('by_parent_id', ['parentPostId'])
      .searchIndex('search_by_content', {
        searchField: 'contentText',
        filterFields: ['parentPostId'],
      }),
    likes: defineTable({
      postId: v.id('posts'),
      userId: v.id('users'),
    })
      .index('by_user_post_id', ['userId', 'postId'])
      .index('by_post_user_id', ['postId', 'userId']),
    follows: defineTable({
      following: v.id('users'), // person being followed
      follower: v.id('users'), // person following
    })
      .index('by_following', ['following'])
      .index('by_follower', ['follower'])
      .index('by_following_follower_id', ['following', 'follower']),
  },
  { schemaValidation: false }
);
