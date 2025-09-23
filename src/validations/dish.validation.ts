import { z } from 'zod';
import { DishStatus, DishTags } from '../models/dish';

const dishTagsSchema = z.nativeEnum(DishTags);
const dishStatusSchema = z.nativeEnum(DishStatus);

export const createDishSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().positive(),
  restaurantId: z.number().int().positive(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  tags: z.array(dishTagsSchema).optional().default([]),
  isAvailable: z.boolean().optional().default(true),
  isPopular: z.boolean().optional().default(false),
  status: dishStatusSchema.optional().default(DishStatus.AVAILABLE),
  rate: z.number().int().min(1).max(5).optional().nullable(),
});

export const updateDishSchema = z
  .object({
    categoryId: z.number().int().positive().optional(),
    name: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    restaurantId: z.number().int().positive().optional(),
    description: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    tags: z.array(dishTagsSchema).optional().nullable(),
    isAvailable: z.boolean().optional(),
    isPopular: z.boolean().optional(),
    status: dishStatusSchema.optional(),
    rate: z.number().int().min(1).max(5).optional().nullable(),
  })
  .partial(); // This ensures all properties are optional
