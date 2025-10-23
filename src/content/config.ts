import { defineCollection, z } from "astro:content";

const plays = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).default([]),
    video: z.string().optional(),
    steps: z.array(
      z.object({
        label: z.string().optional(),
        durationMs: z.number().default(1200),
        players: z.array(z.object({
          id: z.string(), role: z.string().optional(),
          x: z.number(), y: z.number()
        })),
        passes: z.array(z.tuple([z.string(), z.string()])).default([]),
        screens: z.array(z.tuple([z.string(), z.string()])).default([]),
      })
    ),
  }),
});

export const collections = { plays };
