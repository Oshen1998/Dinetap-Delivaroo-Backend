import { z } from 'zod';

export const createCategorySchema = z.object({
  restaurantId: z.number().int().positive(),
  name: z.string().min(1),
  position: z.number().int().optional().nullable(),
});

export const updateCategorySchema = z
  .object({
    restaurantId: z.number().int().positive().optional(),
    name: z.string().min(1).optional(),
    position: z.number().int().optional().nullable(),
  })
  .partial();
