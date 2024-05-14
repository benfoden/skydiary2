import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.create({
        data: {
          content: input.content,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ tagId: z.string(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.update({
        where: { id: input.tagId },
        data: { content: input.content },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.tag.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  getByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.tag.findMany({
      where: { user: { some: { id: ctx.session.user.id } } },
      orderBy: { createdAt: "desc" },
    });
  }),

  getByTagId: protectedProcedure
    .input(z.object({ tagId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.tag.findFirst({
        where: { id: input.tagId },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ tagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.delete({
        where: { id: input.tagId },
      });
    }),
});
