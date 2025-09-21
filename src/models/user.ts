import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'SUPER_ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  status?: UserStatus;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'phoneNumber' | 'status' | 'role'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public phoneNumber?: string;
  public status?: UserStatus;
  public role!: UserRole;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  async comparePassword(candidate: string) {
    return bcrypt.compare(candidate, this.password);
  }
}

export function initUser(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM<UserStatus>('ACTIVE', 'INACTIVE'),
        allowNull: true,
        defaultValue: 'ACTIVE',
      },
      role: {
        type: DataTypes.ENUM<UserRole>('ADMIN', 'CUSTOMER', 'SUPER_ADMIN'),
        allowNull: false,
        defaultValue: 'CUSTOMER',
      },
    },
    {
      tableName: 'users',
      sequelize,
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );
  return User;
}
