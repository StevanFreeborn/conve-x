import { Doc, Id } from '../../../convex/_generated/dataModel';

export type UserDto = {
  _id: Id<'users'>;
  _creationTime: number;
  clerkUsername: string | null;
  clerkImageUrl: string;
  clerkUserId: string;
};

export type PostWithUserDto = Omit<Doc<'posts'>, 'contentText'> & {
  user: UserDto;
};
