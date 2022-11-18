import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

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
});
