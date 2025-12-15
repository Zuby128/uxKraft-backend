import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seeder } from 'nestjs-seeder';
import { OrderProduction } from 'src/base/entities/order-production.entity';
import { OrderItem } from 'src/base/entities/order-item.entity';

@Injectable()
export class OrderProductionSeeder implements Seeder {
  constructor(
    @InjectModel(OrderProduction)
    private readonly orderProductionModel: typeof OrderProduction,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async seed(): Promise<any> {
    // Get first 4 order items (some in production)
    const orderItems = await this.orderItemModel.findAll({
      limit: 4,
      order: [['orderItemId', 'ASC']],
    });

    if (orderItems.length === 0) {
      throw new Error('OrderItems must be seeded first!');
    }

    const productionData = [
      {
        orderItemId: orderItems[0].orderItemId,
        cfaShopsSend: new Date('2024-01-20'),
        cfaShopsApproved: new Date('2024-01-25'),
        cfaShopsDelivered: new Date('2024-02-05'),
      },
      {
        orderItemId: orderItems[1].orderItemId,
        cfaShopsSend: new Date('2024-01-22'),
        cfaShopsApproved: new Date('2024-01-28'),
        cfaShopsDelivered: null, // Still in production
      },
      {
        orderItemId: orderItems[2].orderItemId,
        cfaShopsSend: new Date('2024-01-25'),
        cfaShopsApproved: null,
        cfaShopsDelivered: null,
      },
      {
        orderItemId: orderItems[3].orderItemId,
        cfaShopsSend: new Date('2024-01-18'),
        cfaShopsApproved: new Date('2024-01-22'),
        cfaShopsDelivered: new Date('2024-02-01'),
      },
    ];

    return this.orderProductionModel.bulkCreate(productionData as any, {
      ignoreDuplicates: true,
    });
  }

  async drop(): Promise<any> {
    return this.orderProductionModel.destroy({ where: {}, truncate: true });
  }
}
