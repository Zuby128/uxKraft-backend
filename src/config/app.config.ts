import { config } from 'dotenv';
config();

export const appConfig = {
  nodeEnv: 'development',
  port: parseInt(process.env.PORT as string, 10) || 3000,
  apiPrefix: 'api/v1',
};
