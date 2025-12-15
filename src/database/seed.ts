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
import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '@config/database.config';
import { seedCategories } from './seeder/categories.seeder';
import { seedVendors } from './seeder/vendors.seeder';
import { seedCustomers } from './seeder/customers.seeder';
import { seedItems } from './seeder/items.seeder';
import { seedVendorAddresses } from './seeder/vendor-addresses.seeder';
import { seedOrderItems } from './seeder/order-items.seeder';
import { seedOrderPlanning } from './seeder/order-planning.seeder';
import { seedOrderProduction } from './seeder/order-production.seeder';
import { seedOrderLogistics } from './seeder/order-logistics.seeder';
import { seedUploads } from './seeder/uploads.seeder';

async function runSeeders() {
  console.log('🌱 Starting database seeding...\n');

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
  } as any);

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Initialize models (important!)
    await sequelize.sync();
    console.log('✅ Models initialized\n');

    // Debug: Check registered models
    console.log('📋 Registered models:', Object.keys(sequelize.models));
    console.log('');

    // Run seeders in order
    await seedCategories(sequelize as any);
    await seedVendors(sequelize as any);
    await seedCustomers(sequelize as any);
    await seedItems(sequelize as any);
    await seedVendorAddresses(sequelize as any);
    await seedOrderItems(sequelize as any);
    await seedOrderPlanning(sequelize as any);
    await seedOrderProduction(sequelize as any);
    await seedOrderLogistics(sequelize as any);
    await seedUploads(sequelize as any);

    console.log('\n🎉 ✅ All seeders completed successfully!');
    await sequelize.close();
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
}

runSeeders();
