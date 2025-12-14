import { Module } from '@nestjs/common';
import { OrderPlanningService } from './order-planning.service';
import { OrderPlanningController } from './order-planning.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderPlanning } from 'src/base/entities/order-planning.entity';
import { OrderItem } from 'src/base/entities/order-item.entity';

@Module({
  imports: [SequelizeModule.forFeature([OrderPlanning, OrderItem])],
  providers: [OrderPlanningService],
  controllers: [OrderPlanningController],
  exports: [OrderPlanningService],
})
export class OrderPlanningModule {}
