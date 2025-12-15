import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '../config/database.config';
import { ItemCategory } from 'src/base/entities/item-category.entity';
import { Item } from 'src/base/entities/item.entity';
import { Vendor } from 'src/base/entities/vendor.entity';
import { VendorAddress } from 'src/base/entities/vendor-address.entity';
import { Customer } from 'src/base/entities/customer.entity';
import { OrderItem } from 'src/base/entities/order-item.entity';
import { OrderPlanning } from 'src/base/entities/order-planning.entity';
import { OrderProduction } from 'src/base/entities/order-production.entity';
import { OrderLogistics } from 'src/base/entities/order-logistics.entity';
import { Upload } from 'src/base/entities/upload.entity';

async function runMigrations() {
  console.log('🔄 Starting database migration...');

  const sequelize = new Sequelize({
    ...databaseConfig,
    models: [
      ItemCategory,
      Item,
      Vendor,
      VendorAddress,
      Customer,
      OrderItem,
      OrderPlanning,
      OrderProduction,
      OrderLogistics,
      Upload,
    ],
  });

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
    process.exit(1);
  }
}

runMigrations();
