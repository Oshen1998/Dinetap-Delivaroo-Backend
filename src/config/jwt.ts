import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  accessSecret: process.env['JWT_ACCESS_SECRET'],
  refreshSecret: process.env['JWT_REFRESH_SECRET'] || 'refresh-secret',
  accessExpiresIn: process.env['JWT_ACCESS_EXP'] || '1d', // this should be 10-15/ dev purpose increase that amount
  refreshExpiresIn: process.env['JWT_ACCESS_EXP'] || '30d',
};
