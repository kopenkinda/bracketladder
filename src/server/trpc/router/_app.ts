import { router } from '../trpc';
import { authRouter } from './auth';
import { tournamentRouter } from './tournament';

export const appRouter = router({
  auth: authRouter,
  tournament: tournamentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
