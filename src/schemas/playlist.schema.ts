import { z } from 'zod';

/**
 * Schema for playlist ID parameter validation
 */
export const getPlaylistSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, 'Playlist ID is required')
      .max(100, 'Playlist ID too long')
      .regex(/^[a-zA-Z0-9]+$/, 'Invalid playlist ID format'),
  }),
  query: z
    .object({
      limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 50))
        .refine((val) => val >= 1 && val <= 50, 'Limit must be between 1 and 50'),
      offset: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 0))
        .refine((val) => val >= 0, 'Offset must be non-negative'),
    })
    .optional(),
});

export type GetPlaylistRequest = z.infer<typeof getPlaylistSchema>;
