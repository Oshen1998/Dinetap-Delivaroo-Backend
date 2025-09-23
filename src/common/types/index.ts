import { Model } from 'sequelize';
import { Dish } from '../../models/dish';

export interface CategoryWithDishes extends Model {
  id: number;
  name: string;
  dishes: Dish[];
}
