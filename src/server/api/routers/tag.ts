import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.create({
        data: {
          content: input.content,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.tag.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getByUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.tag.findMany({
      where: { user: { some: { id: ctx.session.user.id } } },
      orderBy: { createdAt: "desc" },
    });
  }),

  getByPostId: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.tag.findMany({
        where: { post: { some: { id: input.postId } } },
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
