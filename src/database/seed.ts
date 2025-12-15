import { seeder } from 'nestjs-seeder';
import { SeederModule } from './seeder.module';
import { CategoriesSeeder } from './seeder/categories.seeder';
import { VendorsSeeder } from './seeder/vendors.seeder';
import { CustomersSeeder } from './seeder/customers.seeder';
import { ItemsSeeder } from './seeder/items.seeder';
import { VendorAddressesSeeder } from './seeder/vendor-addresses.seeder';
import { OrderItemsSeeder } from './seeder/order-items.seeder';
import { OrderPlanningSeeder } from './seeder/order-planning.seeder';
import { OrderProductionSeeder } from './seeder/order-production.seeder';
import { OrderLogisticsSeeder } from './seeder/order-logistics.seeder';
import { UploadsSeeder } from './seeder/uploads.seeder';

seeder({
  imports: [SeederModule],
}).run([
  CategoriesSeeder, // 1. Categories first
  VendorsSeeder, // 2. Vendors
  CustomersSeeder, // 3. Customers
  ItemsSeeder, // 4. Items (depends on Categories)
  VendorAddressesSeeder, // 5. Vendor Addresses (depends on Vendors)
  OrderItemsSeeder, // 6. Order Items (depends on Items, Vendors, VendorAddresses, Customers)
  OrderPlanningSeeder, // 7. Order Planning (depends on OrderItems)
  OrderProductionSeeder, // 8. Order Production (depends on OrderItems)
  OrderLogisticsSeeder, // 9. Order Logistics (depends on OrderItems)
  UploadsSeeder, // 10. Uploads (depends on OrderItems)
]);
