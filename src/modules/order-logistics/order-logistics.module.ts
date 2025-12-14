import { Module } from '@nestjs/common';
import { OrderLogisticsService } from './order-logistics.service';
import { OrderLogisticsController } from './order-logistics.controller';
import { OrderItem } from 'src/base/entities/order-item.entity';
import { OrderLogistics } from 'src/base/entities/order-logistics.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([OrderLogistics, OrderItem])],
  providers: [OrderLogisticsService],
  controllers: [OrderLogisticsController],
  exports: [OrderLogisticsService],
})
export class OrderLogisticsModule {}
