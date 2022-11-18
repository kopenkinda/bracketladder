import type { Roles } from '@prisma/client';
import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: Roles;
    } & DefaultSession['user'];
  }
}
