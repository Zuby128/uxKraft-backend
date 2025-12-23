import { Module } from '@nestjs/common';
import { OrderLogisticsService } from './order-logistics.service';
import { OrderLogisticsController } from './order-logistics.controller';
import { OrderLogistics } from 'src/base/entities/order-logistics.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from 'src/base/entities/item.entity';

@Module({
  imports: [SequelizeModule.forFeature([OrderLogistics, Item])],
  providers: [OrderLogisticsService],
  controllers: [OrderLogisticsController],
  exports: [OrderLogisticsService],
})
export class OrderLogisticsModule {}
