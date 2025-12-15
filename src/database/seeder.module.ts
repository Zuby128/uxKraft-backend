// import { databaseConfig } from '@config/database.config';
// import { Module } from '@nestjs/common';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { Customer } from 'src/base/entities/customer.entity';
// import { ItemCategory } from 'src/base/entities/item-category.entity';
// import { Item } from 'src/base/entities/item.entity';
// import { VendorAddress } from 'src/base/entities/vendor-address.entity';
// import { Vendor } from 'src/base/entities/vendor.entity';

// import { VendorsSeeder } from './seeder/vendors.seeder';
// import { CustomersSeeder } from './seeder/customers.seeder';
// import { ItemsSeeder } from './seeder/items.seeder';
// import { OrderItem } from 'src/base/entities/order-item.entity';
// import { OrderPlanning } from 'src/base/entities/order-planning.entity';
// import { OrderProduction } from 'src/base/entities/order-production.entity';
// import { OrderLogistics } from 'src/base/entities/order-logistics.entity';
// import { Upload } from 'src/base/entities/upload.entity';
// import { VendorAddressesSeeder } from './seeder/vendor-addresses.seeder';
// import { OrderItemsSeeder } from './seeder/order-items.seeder';
// import { OrderPlanningSeeder } from './seeder/order-planning.seeder';
// import { OrderProductionSeeder } from './seeder/order-production.seeder';
// import { OrderLogisticsSeeder } from './seeder/order-logistics.seeder';
// import { UploadsSeeder } from './seeder/uploads.seeder';

// @Module({
//   imports: [
//     SequelizeModule.forRoot(databaseConfig),
//     SequelizeModule.forFeature([
//       ItemCategory,
//       Item,
//       Vendor,
//       VendorAddress,
//       Customer,
//       OrderItem,
//       OrderPlanning,
//       OrderProduction,
//       OrderLogistics,
//       Upload,
//     ]),
//   ],
//   providers: [
//     CategoriesSeeder,
//     VendorsSeeder,
//     CustomersSeeder,
//     ItemsSeeder,
//     VendorAddressesSeeder,
//     OrderItemsSeeder,
//     OrderPlanningSeeder,
//     OrderProductionSeeder,
//     OrderLogisticsSeeder,
//     UploadsSeeder,
//   ],
//   exports: [
//     CategoriesSeeder,
//     VendorsSeeder,
//     CustomersSeeder,
//     ItemsSeeder,
//     VendorAddressesSeeder,
//     OrderItemsSeeder,
//     OrderPlanningSeeder,
//     OrderProductionSeeder,
//     OrderLogisticsSeeder,
//     UploadsSeeder,
//   ],
// })
// export class SeederModule {}
