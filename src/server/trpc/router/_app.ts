import { router } from '../trpc';
import { authRouter } from './auth';
import { mailRouter } from './mail';
import { tournamentRouter } from './tournament';
import { userRouter } from './user';

export const appRouter = router({
	auth: authRouter,
	tournament: tournamentRouter,
	user: userRouter,
	mail: mailRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
