import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seeder } from 'nestjs-seeder';
import { OrderPlanning } from 'src/base/entities/order-planning.entity';
import { OrderItem } from 'src/base/entities/order-item.entity';

@Injectable()
export class OrderPlanningSeeder implements Seeder {
  constructor(
    @InjectModel(OrderPlanning)
    private readonly orderPlanningModel: typeof OrderPlanning,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async seed(): Promise<any> {
    // Get first 5 order items
    const orderItems = await this.orderItemModel.findAll({
      limit: 5,
      order: [['orderItemId', 'ASC']],
    });

    if (orderItems.length === 0) {
      throw new Error('OrderItems must be seeded first!');
    }

    const planningData = [
      {
        orderItemId: orderItems[0].orderItemId,
        poApprovalDate: new Date('2024-01-10'),
        hotelNeedByDate: new Date('2024-02-15'),
        expectedDelivery: new Date('2024-02-10'),
      },
      {
        orderItemId: orderItems[1].orderItemId,
        poApprovalDate: new Date('2024-01-12'),
        hotelNeedByDate: new Date('2024-02-20'),
        expectedDelivery: new Date('2024-02-15'),
      },
      {
        orderItemId: orderItems[2].orderItemId,
        poApprovalDate: new Date('2024-01-15'),
        hotelNeedByDate: new Date('2024-03-01'),
        expectedDelivery: new Date('2024-02-25'),
      },
      {
        orderItemId: orderItems[3].orderItemId,
        poApprovalDate: new Date('2024-01-08'),
        hotelNeedByDate: new Date('2024-02-10'),
        expectedDelivery: new Date('2024-02-05'),
      },
      {
        orderItemId: orderItems[4].orderItemId,
        poApprovalDate: new Date('2024-01-20'),
        hotelNeedByDate: new Date('2024-03-15'),
        expectedDelivery: new Date('2024-03-10'),
      },
    ];

    return this.orderPlanningModel.bulkCreate(planningData as any, {
      ignoreDuplicates: true,
    });
  }

  async drop(): Promise<any> {
    return this.orderPlanningModel.destroy({ where: {}, truncate: true });
  }
}
