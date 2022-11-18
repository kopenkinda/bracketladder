import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const tournamentRouter = router({
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

  
});
