import { Games } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import type { InviteTokenData } from './mail';

export const tournamentRouter = router({
  getAllPublic: publicProcedure
    .input(
      z.enum([Games.SmashBros, Games.StreetFighter, Games.Tekken]).optional()
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.tournament.findMany({
        where: {
          type: {
            not: 'Private',
          },
          game: input,
        },
        include: { owner: true },
      });
    }),
  getOne: publicProcedure
    .input(z.string({ description: 'Tournament ID' }))
    .query(({ input, ctx }) => {
      return (
        ctx.prisma.tournament.findUnique({
          where: { id: input },
          include: { owner: true },
        }) || null
      );
    }),
  getByOwner: protectedProcedure
    .input(z.string({ description: 'Owner ID' }))
    .query(({ ctx, input }) => {
      return prisma?.tournament.findMany({
        where: {
          ownerId: input,
          type: input === ctx.session.user.id ? undefined : { not: 'Private' },
        },
      });
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
      })
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
    .mutation(async ({ input, ctx }) => {
      const secret = process.env.JWT_SECRET;
      try {
        const content = jwt.verify(
          input.token,
          secret as string
        ) as InviteTokenData;
        const tournament = await ctx.prisma.tournament.update({
          where: { id: content.tournamentId },
          data: {
            users: {
              connect: { id: ctx.session.user.id },
            },
          },
        });
        return { tournament };
      } catch (e) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid token' });
      }
    }),
  tournamentParticipation: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tournament.findMany({
      where: {
        users: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),
  getTournamentByOwner: publicProcedure
    .input(z.string({ description: 'Owner ID' }))
    .query(({ input }) => {
      return (
        prisma?.tournament.findMany({
          where: {
            ownerId: input,
          },
          include: { owner: true },
        }) || null
      );
    }),
});
