import { defineCollection, z } from 'astro:content';

const episodeSchema = z.object({
  title: z.string(),
  seriesLabel: z.string(),
  episode: z.number(),
  description: z.string().optional(),
  points: z.array(z.string()).optional(),
  evaluation: z.string().optional(),
  epilogue: z.string().optional(),
});

const articleSchema = z.object({
  title: z.string(),
  seriesLabel: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
});

export const collections = {
  'claude-series': defineCollection({ type: 'content', schema: episodeSchema }),
  'notebooklm-series': defineCollection({ type: 'content', schema: episodeSchema }),
  'obsidian-series': defineCollection({ type: 'content', schema: episodeSchema }),
  'verification-series': defineCollection({ type: 'content', schema: articleSchema }),
};
