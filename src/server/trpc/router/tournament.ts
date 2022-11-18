import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const tournamentRouter = router({
	getAll: publicProcedure.query(() => {
		return prisma?.tournament.findMany({ include: { owner: true } }) || [];
	}),
	getOne: publicProcedure
		.input(z.string({ description: 'Tournament ID' }))
		.query(({ input }) => {
			return prisma?.tournament.findUnique({
				where: { id: input },
				include: { owner: true }
			}) || null;
		}),
});