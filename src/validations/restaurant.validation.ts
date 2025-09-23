import { z } from 'zod';

export const restaurantStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);

export const tagArraySchema = z.array(z.string());

export const createRestaurantSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1, 'Name is required'),
  status: restaurantStatusSchema,
  description: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  currencyCode: z.string().optional(),
  tags: tagArraySchema.optional(),
  rate: z.number().nullable().optional(),
  long: z.number().optional(),
  lat: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
