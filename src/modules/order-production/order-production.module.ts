import { Module } from '@nestjs/common';
import { OrderProductionService } from './order-production.service';
import { OrderProductionController } from './order-production.controller';
import { OrderItem } from 'src/base/entities/order-item.entity';
import { OrderProduction } from 'src/base/entities/order-production.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([OrderProduction, OrderItem])],
  providers: [OrderProductionService],
  controllers: [OrderProductionController],
})
export class OrderProductionModule {}
