import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
    // route hello : /api/example/hello
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
    // route hello : /api/example/getall
    getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
