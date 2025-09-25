import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  accessSecret: process.env['JWT_ACCESS_SECRET'],
  refreshSecret: process.env['JWT_REFRESH_SECRET'] || 'refresh-secret',
  accessExpiresIn: process.env['JWT_ACCESS_EXP'] || '30m',
  refreshExpiresIn: process.env['JWT_ACCESS_EXP'] || '30d',
};
