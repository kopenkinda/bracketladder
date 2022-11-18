import { publicProcedure, router } from '../trpc';

export const tournamentRouter = router({
	getAll: publicProcedure.query(() => {
		return prisma?.tournament.findMany({ include: { owner: true } }) || [];
	}),
});