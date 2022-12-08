import { Games } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

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
    .query(({ input }) => {
      return (
        prisma?.tournament.findUnique({
          where: { id: input },
          include: { owner: true },
        }) || null
      );
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
  createBracket: protectedProcedure
    .input(
      z.object({
        tournamentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tournament = await ctx.prisma.tournament.findUnique({
        where: { id: input.tournamentId },
        include: {
          bracket: true,
          users: true,
          whitelist: { include: { users: true } },
        },
      });
      if (!tournament) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tournament not found',
        });
      }
      if (tournament.ownerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            'You are not allowed to create a bracket for this tournament',
        });
      }
      if (tournament.bracket !== null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Tournament already has a bracket',
        });
      }
      let amountOfPlayers = 0;
      if (tournament.type === 'Private') {
        if (
          tournament.whitelist === null ||
          tournament.whitelist.users.length < tournament.minPlayers
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Not enough players in the whitelist',
          });
        }
        amountOfPlayers = tournament.whitelist.users.length;
      }
      console.log({ tournament: JSON.stringify(tournament, null, 2) });
      if (tournament.type === 'Public') {
        if (tournament.users.length < tournament.minPlayers) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Not enough players in the tournament',
          });
        }
        amountOfPlayers = tournament.users.length;
      }
      const bracket = await ctx.prisma.bracket.create({
        data: {
          tournament: { connect: { id: tournament.id } },
        },
      });
      let steps = 1;
      while (Math.pow(2, steps) < amountOfPlayers) {
        steps += 1;
      }
      for (let i = 0; i < steps; i++) {
        await ctx.prisma.bracketLevel.create({
          data: {
            bracket: { connect: { id: bracket.id } },
            bestOf: 3,
          },
        });
      }
      return await ctx.prisma.bracket.findUnique({
        where: {
          id: bracket.id,
        },
      });
    }),
  getBracket: publicProcedure
    .input(z.object({ tournamentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tournament = await ctx.prisma.tournament.findUnique({
        where: { id: input.tournamentId },
        include: { bracket: true },
      });
      if (!tournament) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tournament not found',
        });
      }
      if (tournament.bracket === null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Tournament does not have a bracket',
        });
      }
      return await ctx.prisma.bracket.findUnique({
        where: {
          id: tournament.bracket.id,
        },
        include: {
          levels: {
            include: {
              rounds: {
                include: {
                  matches: { include: { player1: true, player2: true } },
                  winner: true,
                },
              },
            },
          },
        },
      });
    }),
});
