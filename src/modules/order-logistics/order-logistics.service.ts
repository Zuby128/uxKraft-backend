import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { CreateOrderLogisticsDto } from './dto/create-order-logistics.dto';
import { UpdateOrderLogisticsDto } from './dto/update-order-logistics.dto';
import { OrderLogistics } from 'src/base/entities/order-logistics.entity';
import { OrderItem } from 'src/base/entities/order-item.entity';

@Injectable()
export class OrderLogisticsService {
  constructor(
    @InjectModel(OrderLogistics)
    private readonly orderLogisticsModel: typeof OrderLogistics,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async create(
    createOrderLogisticsDto: CreateOrderLogisticsDto,
  ): Promise<OrderLogistics> {
    // Verify order item exists
    const orderItem = await this.orderItemModel.findByPk(
      createOrderLogisticsDto.orderItemId,
    );
    if (!orderItem) {
      throw new BadRequestException(
        `Order item with ID ${createOrderLogisticsDto.orderItemId} not found`,
      );
    }

    // Check if logistics already exists for this order item (one-to-one)
    const existingLogistics = await this.orderLogisticsModel.findOne({
      where: { orderItemId: createOrderLogisticsDto.orderItemId },
    });

    if (existingLogistics) {
      throw new ConflictException(
        `Logistics already exists for order item ID ${createOrderLogisticsDto.orderItemId}`,
      );
    }

    try {
      const logistics = await this.orderLogisticsModel.create(
        createOrderLogisticsDto as unknown as CreationAttributes<OrderLogistics>,
      );
      return this.findOne(logistics.logisticsId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create order logistics',
      );
    }
  }

  async findAll(): Promise<OrderLogistics[]> {
    return this.orderLogisticsModel.findAll({
      include: [OrderItem],
      order: [['logisticsId', 'DESC']],
    });
  }

  async findOne(id: number): Promise<OrderLogistics> {
    const logistics = await this.orderLogisticsModel.findByPk(id, {
      include: [OrderItem],
    });

    if (!logistics) {
      throw new NotFoundException(`Order logistics with ID ${id} not found`);
    }

    return logistics;
  }

  async findByOrderItem(orderItemId: number): Promise<OrderLogistics> {
    const orderItem = await this.orderItemModel.findByPk(orderItemId);
    if (!orderItem) {
      throw new NotFoundException(
        `Order item with ID ${orderItemId} not found`,
      );
    }

    const logistics = await this.orderLogisticsModel.findOne({
      where: { orderItemId },
      include: [OrderItem],
    });

    if (!logistics) {
      throw new NotFoundException(
        `Order logistics for order item ID ${orderItemId} not found`,
      );
    }

    return logistics;
  }

  async update(
    id: number,
    updateOrderLogisticsDto: UpdateOrderLogisticsDto,
  ): Promise<OrderLogistics> {
    const logistics = await this.findOne(id);

    try {
      await logistics.update(updateOrderLogisticsDto as any);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update order logistics',
      );
    }
  }

  async remove(id: number): Promise<void> {
    const logistics = await this.findOne(id);
    await logistics.destroy(); // Hard delete (no soft delete for logistics)
  }

  async bulkUpdate(
    orderItemIds: number[],
    updateData: {
      orderedDate?: string;
      shippedDate?: string;
      deliveredDate?: string;
      shippingNotes?: string;
    },
  ): Promise<{ totalCount: number; results: OrderLogistics[] }> {
    const orderItems = await this.orderItemModel.findAll({
      where: { orderItemId: orderItemIds },
    });

    if (orderItems.length === 0) {
      throw new NotFoundException('No order items found with the provided IDs');
    }

    if (orderItems.length !== orderItemIds.length) {
      const foundIds = orderItems.map((item) => item.orderItemId);
      const notFoundIds = orderItemIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(
        `Order items not found: ${notFoundIds.join(', ')}`,
      );
    }

    try {
      await this.orderLogisticsModel.bulkCreate(
        orderItemIds.map((orderItemId) => ({
          orderItemId,
          ...updateData,
        })) as any,
        {
          updateOnDuplicate: [
            'orderedDate',
            'shippedDate',
            'deliveredDate',
            'shippingNotes',
            'updatedAt',
          ],
        },
      );

      const results = await this.orderLogisticsModel.findAll({
        where: { orderItemId: orderItemIds },
        include: [OrderItem],
        order: [['logisticsId', 'ASC']],
      });

      return {
        totalCount: results.length,
        results,
      };
    } catch (error) {
      console.error('Bulk update error:', error);
      throw new InternalServerErrorException(
        'Failed to bulk update order logistics',
      );
    }
  }
}
