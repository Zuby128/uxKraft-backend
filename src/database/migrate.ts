import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '../config/database.config';
import { ItemCategory } from 'src/base/entities/item-category.entity';

import { Item } from 'src/base/entities/item.entity';
import { Vendor } from 'src/base/entities/vendor.entity';
import { Customer } from 'src/base/entities/customer.entity';
import { Address } from 'src/base/entities/address.entity';
import { OrderPlanning } from 'src/base/entities/order-planning.entity';
import { OrderProduction } from 'src/base/entities/order-production.entity';
import { OrderLogistics } from 'src/base/entities/order-logistics.entity';
import { Upload } from 'src/base/entities/upload.entity';

async function runMigrations() {
  console.log('🔄 Starting database migration...');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL missing');
  }

  // Create Sequelize instance with models
  const sequelize = new Sequelize({
    ...databaseConfig,
    models: [
      ItemCategory,
      Item,
      Vendor,
      Customer,
      Address,
      OrderProduction,
      OrderPlanning,
      OrderLogistics,
      Upload,
    ],
  } as any);
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('🎉 All tables created/updated successfully');

    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
