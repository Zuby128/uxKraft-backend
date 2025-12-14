import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItem } from 'src/base/entities/order-item.entity';
import { Item } from 'src/base/entities/item.entity';
import { Vendor } from 'src/base/entities/vendor.entity';
import { VendorAddress } from 'src/base/entities/vendor-address.entity';
import { Customer } from 'src/base/entities/customer.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      OrderItem,
      Item,
      Vendor,
      VendorAddress,
      Customer,
    ]),
  ],
  providers: [OrderItemsService],
  controllers: [OrderItemsController],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
