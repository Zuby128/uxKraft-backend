import { Module } from '@nestjs/common';
import { OrderProductionService } from './order-production.service';
import { OrderProductionController } from './order-production.controller';
import { OrderProduction } from 'src/base/entities/order-production.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from 'src/base/entities/item.entity';

@Module({
  imports: [SequelizeModule.forFeature([OrderProduction, Item])],
  providers: [OrderProductionService],
  controllers: [OrderProductionController],
})
export class OrderProductionModule {}
