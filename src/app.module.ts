import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';
import { ItemCategoryModule } from '@modules/item-category/item-category.module';
import { ItemModule } from '@modules/item/item.module';
import { VendorsModule } from '@modules/vendors/vendors.module';
import { CustomersModule } from '@modules/customers/customers.module';
import { UploadsModule } from '@modules/uploads/uploads.module';
import { OrderItemsModule } from '@modules/order-items/order-items.module';
import { OrderPlanningModule } from '@modules/order-planning/order-planning.module';
import { OrderProductionModule } from '@modules/order-production/order-production.module';
import { OrderLogisticsModule } from '@modules/order-logistics/order-logistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    SequelizeModule.forRoot(databaseConfig),

    ItemCategoryModule,
    ItemModule,
    VendorsModule,
    CustomersModule,
    UploadsModule,
    OrderItemsModule,
    OrderPlanningModule,
    OrderProductionModule,
    OrderLogisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
