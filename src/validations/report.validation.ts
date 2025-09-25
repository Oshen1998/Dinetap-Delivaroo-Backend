import z from 'zod';

export const salesQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month']),
  status: z
    .string()
    .transform(val => val.split(','))
    .optional(),
  startDate: z
    .string()
    .datetime()
    .transform(val => new Date(val))
    .optional(),
  endDate: z
    .string()
    .datetime()
    .transform(val => new Date(val))
    .optional(),
});

export const topItemsQuerySchema = z.object({
  metric: z.enum(['quantity', 'revenue']),
  status: z
    .string()
    .optional()
    .transform(val => (val ? val.split(',') : [])),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
