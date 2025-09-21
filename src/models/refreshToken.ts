import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import crypto from 'crypto';

interface RefreshTokenAttributes {
  id: number;
  hashedToken: string;
  userId: number;
  revokedAt?: Date | null;
  replacedByToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt: Date;
}

export interface RefreshTokenCreationAttributes
  extends Optional<RefreshTokenAttributes, 'id'> {}

export class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  public id!: number;
  public hashedToken!: string;
  public userId!: number;
  public revokedAt?: Date | null;
  public replacedByToken?: string | null;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  get isExpired() {
    return new Date() > this.expiresAt;
  }

  get isActive() {
    return !this.revokedAt && !this.isExpired;
  }
}

export function initRefreshToken(sequelize: Sequelize) {
  RefreshToken.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      hashedToken: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      replacedByToken: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'refresh_tokens',
      sequelize,
    }
  );
  return RefreshToken;
}
