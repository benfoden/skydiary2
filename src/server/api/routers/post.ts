import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          content: input.content,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  addTags: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        tagIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.update({
        where: { id: input.postId },
        data: {
          tags: {
            connect: input.tagIds.map((tagId: string) => ({
              id: tagId,
            })),
          },
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ postId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { id: input.postId },
        data: { content: input.content },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getTagsAndCounts: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
      select: {
        tags: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });

    const tagCountMap: Record<
      string,
      { content: string; id: string; count: number }
    > = {};

    posts.forEach((post: { tags: { id: string; content: string }[] }) => {
      post.tags.forEach((tag: { id: string; content: string }) => {
        if (tagCountMap[tag.id]) {
          tagCountMap[tag.id]!.count += 1;
        } else {
          tagCountMap[tag.id] = { content: tag.content, id: tag.id, count: 1 };
        }
      });
    });

    const tagsList = Object.values(tagCountMap).sort((a, b) =>
      a.content.localeCompare(b.content),
    );

    return tagsList;
  }),

  getAllByUserAndTagId: protectedProcedure
    .input(z.object({ tagId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: {
          AND: [
            { createdBy: { id: ctx.session.user.id } },
            { tags: { some: { id: input.tagId } } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
      orderBy: { createdAt: "desc" },
    });
  }),

  getByPostId: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findFirst({
        where: { id: input.postId },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({
        where: { id: input.postId, createdBy: { id: ctx.session.user.id } },
      });
    }),
});
