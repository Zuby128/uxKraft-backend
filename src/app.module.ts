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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
