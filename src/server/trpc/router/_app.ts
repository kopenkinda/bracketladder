import { router } from '../trpc';
import { authRouter } from './auth';
import { tournamentRouter } from './tournament';
import { userRouter } from './user';

export const appRouter = router({
	auth: authRouter,
	tournament: tournamentRouter,
	user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
