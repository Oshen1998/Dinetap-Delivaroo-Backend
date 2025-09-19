import { Router } from 'express';
import { models } from '../models';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /restaurants
 * public list with pagination
 */
router.get('/', async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const pageSize = Math.min(50, parseInt((req.query.pageSize as string) || '10', 10));
  const offset = (page - 1) * pageSize;
  const { rows, count } = await models.Restaurant.findAndCountAll({
    limit: pageSize,
    offset
  });
  res.json({ data: rows, meta: { page, pageSize, total: count } });
});

/**
 * GET /restaurants/:id
 */
router.get('/:id', async (req, res) => {
  const r = await models.Restaurant.findByPk(req.params.id, {
    include: [{ model: models.Category, include: [models.Dish] }]
  });
  if (!r) return res.status(404).json({ error: 'not_found' });
  res.json(r);
});

/**
 * Protected route example
 */
router.post('/', authenticate, async (req, res) => {
  const { name, description } = req.body;
  const r = await models.Restaurant.create({ name, description });
  res.status(201).json(r);
});

export default router;
