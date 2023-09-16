import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/about', '/contact', '/terms', '/privacy'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
