import { Module } from '@nestjs/common';
import { OrderPlanningService } from './order-planning.service';
import { OrderPlanningController } from './order-planning.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderPlanning } from 'src/base/entities/order-planning.entity';
import { Item } from 'src/base/entities/item.entity';

@Module({
  imports: [SequelizeModule.forFeature([OrderPlanning, Item])],
  providers: [OrderPlanningService],
  controllers: [OrderPlanningController],
  exports: [OrderPlanningService],
})
export class OrderPlanningModule {}
