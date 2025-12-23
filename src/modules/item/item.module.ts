import { Module } from '@nestjs/common';
import { ItemCategory } from 'src/base/entities/item-category.entity';
import { Item } from 'src/base/entities/item.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemsService } from './item.service';
import { ItemsController } from './item.controller';
import { Vendor } from 'src/base/entities/vendor.entity';
import { OrderLogistics } from 'src/base/entities/order-logistics.entity';
import { OrderPlanning } from 'src/base/entities/order-planning.entity';
import { OrderProduction } from 'src/base/entities/order-production.entity';
import { Customer } from 'src/base/entities/customer.entity';
import { Upload } from 'src/base/entities/upload.entity';
import { Address } from 'src/base/entities/address.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Address,
      Item,
      ItemCategory,
      Vendor,
      Customer,
      Upload,
      OrderPlanning,
      OrderProduction,
      OrderLogistics,
    ]),
  ],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService],
})
export class ItemModule {}
