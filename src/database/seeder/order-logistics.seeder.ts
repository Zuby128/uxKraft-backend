import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seeder } from 'nestjs-seeder';
import { OrderLogistics } from 'src/base/entities/order-logistics.entity';
import { OrderItem } from 'src/base/entities/order-item.entity';

@Injectable()
export class OrderLogisticsSeeder implements Seeder {
  constructor(
    @InjectModel(OrderLogistics)
    private readonly orderLogisticsModel: typeof OrderLogistics,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async seed(): Promise<any> {
    // Get first 3 order items (shipped/delivered orders)
    const orderItems = await this.orderItemModel.findAll({
      limit: 3,
      order: [['orderItemId', 'ASC']],
    });

    if (orderItems.length === 0) {
      throw new Error('OrderItems must be seeded first!');
    }

    const logisticsData = [
      {
        orderItemId: orderItems[0].orderItemId,
        orderedDate: new Date('2024-02-06'),
        shippedDate: new Date('2024-02-08'),
        deliveredDate: new Date('2024-02-12'),
        shippingNotes: 'Standard shipping - Delivered on time',
      },
      {
        orderItemId: orderItems[1].orderItemId,
        orderedDate: new Date('2024-02-10'),
        shippedDate: new Date('2024-02-12'),
        deliveredDate: null, // In transit
        shippingNotes: 'Express shipping - Tracking: XYZ123456',
      },
      {
        orderItemId: orderItems[2].orderItemId,
        orderedDate: new Date('2024-02-15'),
        shippedDate: null,
        deliveredDate: null,
        shippingNotes: 'Waiting for production completion',
      },
    ];

    return this.orderLogisticsModel.bulkCreate(logisticsData as any, {
      ignoreDuplicates: true,
    });
  }

  async drop(): Promise<any> {
    return this.orderLogisticsModel.destroy({ where: {}, truncate: true });
  }
}
