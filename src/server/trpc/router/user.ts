import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const userRouter = router({
  getTournaments: protectedProcedure
    .input(z.string({ description: 'User ID' }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user
        .findUnique({
          where: { id: input },
          include: { particiaptesInTournaments: true },
        })
        .then((res) => res?.particiaptesInTournaments || []);
    }),
});
