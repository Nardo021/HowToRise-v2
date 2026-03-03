import { z } from "zod";

export const tutorialUpsertSchema = z.object({
  slug: z.string().min(2).max(120),
  status: z.enum(["draft", "published", "offline"]),
  categorySlug: z.string().optional(),
  tagSlugs: z.array(z.string()).optional(),
  youtubeUrl: z
    .string()
    .url()
    .refine((value) => {
      const host = new URL(value).hostname.toLowerCase();
      return host.includes("youtube.com") || host.includes("youtu.be");
    }, "Only YouTube URL is allowed")
    .optional()
    .or(z.literal("")),
  zh: z.object({
    title: z.string().min(1),
    summary: z.string().optional(),
    contentMd: z.string().min(1),
    seoTitle: z.string().optional(),
    seoDesc: z.string().optional()
  }),
  en: z.object({
    title: z.string().min(1),
    summary: z.string().optional(),
    contentMd: z.string().min(1),
    seoTitle: z.string().optional(),
    seoDesc: z.string().optional()
  })
});

export type TutorialUpsertInput = z.infer<typeof tutorialUpsertSchema>;
