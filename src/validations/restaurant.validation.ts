import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().max(1000).optional(),
  address: z.string().min(5).max(512),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
