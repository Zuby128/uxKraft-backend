import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { config } from 'dotenv';
config();

// Parse Heroku DATABASE_URL if exists
function parseDatabaseUrl(): Partial<SequelizeModuleOptions> | null {
  const databaseUrl = process.env.DATABASE_URL;

  console.log('🔍 DATABASE_URL:', databaseUrl ? 'EXISTS' : 'NOT FOUND');

  if (!databaseUrl) {
    return null;
  }

  try {
    const url = new URL(databaseUrl);
    const parsed = {
      dialect: 'postgres' as const,
      host: url.hostname,
      port: parseInt(url.port, 10) || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading '/'
      dialectOptions: {
        ssl:
          process.env.NODE_ENV === 'production'
            ? {
                require: true,
                rejectUnauthorized: false, // Essential for Heroku/DigitalOcean/AWS
              }
            : false,
      },
      // dialectOptions: {
      //   ssl: {
      //     require: true,
      //     rejectUnauthorized: false, // Heroku requires this
      //   },
      // },
    };

    console.log('✅ Parsed DATABASE_URL:', {
      host: parsed.host,
      port: parsed.port,
      database: parsed.database,
    });

    return parsed;
  } catch (error) {
    console.error('❌ Failed to parse DATABASE_URL:', error);
    return null;
  }
}

const herokuConfig = parseDatabaseUrl();

console.log('📊 Using config:', herokuConfig ? 'HEROKU' : 'LOCAL');

export const databaseConfig: SequelizeModuleOptions = herokuConfig
  ? {
      ...herokuConfig,
      autoLoadModels: true,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 20,
        min: 5,
        acquire: 60000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
      },
    }
  : {
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT as string, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nestjs_db',
      autoLoadModels: true,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 20,
        min: 5,
        acquire: 60000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
      },
    };
