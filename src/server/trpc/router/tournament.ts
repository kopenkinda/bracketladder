import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { procedureIsTournamentOwner } from '../procedure/tournament';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import type { InviteTokenData } from './mail';

export const tournamentRouter = router({
	getAll: publicProcedure.query(() => {
		return prisma?.tournament.findMany({ include: { owner: true } }) || [];
	}),
	getOne: publicProcedure
		.input(z.string({ description: 'Tournament ID' }))
		.query(({ input }) => {
			return (
				prisma?.tournament.findUnique({
					where: { id: input },
					include: { owner: true },
				}) || null
			);
		}),
	getByOwner: protectedProcedure
		.input(z.string({ description: 'Owner ID' }))
		.query(({ input }) => {
			return prisma?.tournament.findMany({
				where: { ownerId: input },
			});
		}),
	isOwner: procedureIsTournamentOwner
		.input(z.object({ tournamentId: z.string() }))
		.query(() => {
			return true;
		}),
	create: protectedProcedure
		.input(
			z.object({
				type: z.enum(['Private', 'Public', 'Official']),
				name: z.string(),
				description: z.string().optional(),
				minPlayers: z.number().min(4).default(4),
				maxPlayers: z.number().max(200).default(8),
				game: z.enum(['SmashBros', 'StreetFighter', 'Tekken']),
				allocatedServer: z.boolean().default(false),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const createdTournament = await ctx.prisma.tournament.create({
				data: {
					allocatedServer: input.allocatedServer,
					description: input.description ?? '',
					maxPlayers: input.maxPlayers,
					minPlayers: input.minPlayers,
					name: input.name,
					game: input.game,
					type: input.type,
					owner: { connect: { id: ctx.session.user.id } },
					region: 'Europe',
					whitelist: input.type === 'Private' ? { create: {} } : undefined,
				},
			});
			return createdTournament;
		}),

	joinTournament: protectedProcedure
		.input(z.object({ tournamentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const publicTournament = await ctx.prisma.tournament.findUnique({
				where: {
					id: input.tournamentId,
				},
			});

			if (!publicTournament) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Tournament not found',
				});
			}

			if (['Public', 'Official'].includes(publicTournament.type)) {
				return await ctx.prisma.tournament.update({
					where: {
						id: input.tournamentId,
					},
					data: {
						users: {
							connect: { id: ctx.session.user.id },
						},
					},
				});
			} else {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You are not allowed to join this tournament',
				});
			}
		}),

	leaveTournament: protectedProcedure
		.input(z.object({ tournamentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const publicTournament = await ctx.prisma.tournament.findUnique({
				where: {
					id: input.tournamentId,
				},
			});

			if (!publicTournament) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Tournament not found',
				});
			}
			return await ctx.prisma.tournament.update({
				where: {
					id: input.tournamentId,
				},
				data: {
					users: {
						disconnect: { id: ctx.session.user.id },
					},
				},
			});
		}),

	addToWhitelist: protectedProcedure
		.input(z.object({ tournamentId: z.string(), userId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const tournament = await ctx.prisma.tournament.findUnique({
				where: {
					id: input.tournamentId,
				},
			});

			if (!tournament) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Tournament not found',
				});
			}

			if (tournament.ownerId === ctx.session.user.id) {
				return await ctx.prisma.tournament.update({
					where: {
						id: input.tournamentId,
					},
					data: {
						users: {
							connect: { id: input.userId },
						},
					},
				});
			} else {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You are not allowed to add users to this tournament',
				});
			}
		}),

	removeFromWhitelist: protectedProcedure
		.input(z.object({ tournamentId: z.string(), userId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const tournament = await ctx.prisma.tournament.findUnique({
				where: {
					id: input.tournamentId,
				},
			});

			if (!tournament) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Tournament not found',
				});
			}

			if (tournament.ownerId === ctx.session.user.id) {
				return await ctx.prisma.tournament.update({
					where: {
						id: input.tournamentId,
					},
					data: {
						users: {
							disconnect: { id: input.userId },
						},
					},
				});
			} else {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You are not allowed to remove users from this tournament',
				});
			}
		}),
	validateInviteToken: protectedProcedure
		.input(z.object({ token: z.string() }))
		.query(async ({ input }) => {
			const secret = process.env.JWT_SECRET;
			if (!secret) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'JWT_SECRET not set' });
			try {
				const content = jwt.verify(input.token, secret) as InviteTokenData;
				return { tournamentId: content.tournamentId };
			}
			catch (e) {
				throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid token' });
			}
		}),
});
