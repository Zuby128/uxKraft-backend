import { config } from 'dotenv';
config();

export const appConfig = {
  nodeEnv: 'development',
  host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  apiPrefix: 'api/v1',
};
