import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from '../trpc';

const isOwnerInputSchema = z.object({ tournamentId: z.string() });

const isOwner = t
	.middleware(async ({ ctx, next, rawInput }) => {
		const input = isOwnerInputSchema.safeParse(rawInput);
		if (!ctx.session || !ctx.session.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
		if (!input.success) throw new TRPCError({ code: 'BAD_REQUEST' });
		const tournament = await prisma?.tournament.findUnique({
			where: { id: input.data.tournamentId },
			include: { owner: true },
		});
		if (!tournament) throw new TRPCError({ code: 'NOT_FOUND', message: 'Tournament not found' });
		const isOwner = ctx.session.user.id === tournament.owner.id;
		if (!isOwner) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not the owner of this tournament' });
		return next({
			ctx: {
				// infers the `session` as non-nullable
				session: { ...ctx.session, user: ctx.session.user },
			},
		});
	});

export const procedureIsTournamentOwner = t.procedure.use(isOwner);
