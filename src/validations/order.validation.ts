import { z } from 'zod';

export const orderCreationSchema = z.object({
  userId: z.number().int().positive(),
  restaurantId: z.number().int().positive(),
  price: z.number().positive(),
});

export const orderUpdateSchema = z.object({
  userId: z.number().int().positive().optional(),
  restaurantId: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
});

export const orderIdSchema = z.object({
  id: z.number().int().positive(),
});
