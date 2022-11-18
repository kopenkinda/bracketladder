import { router } from '../trpc';
import { authRouter } from './auth';
import { exampleRouter } from './example';
import { tournamentRouter } from './tournament';

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  tournament: tournamentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
