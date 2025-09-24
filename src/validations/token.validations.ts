import { z } from 'zod';

export const tokenSchema = z.object({
  refreshToken: z.string(),
});
