import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { OrderPlanning } from 'src/base/entities/order-planning.entity';
import { OrderItem } from 'src/base/entities/order-item.entity';
import { CreateOrderPlanningDto } from './dto/create-order-planning.dto';
import { UpdateOrderPlanningDto } from './dto/update-order-planning.dto';

@Injectable()
export class OrderPlanningService {
  constructor(
    @InjectModel(OrderPlanning)
    private readonly orderPlanningModel: typeof OrderPlanning,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async create(
    createOrderPlanningDto: CreateOrderPlanningDto,
  ): Promise<OrderPlanning> {
    // Verify order item exists
    const orderItem = await this.orderItemModel.findByPk(
      createOrderPlanningDto.orderItemId,
    );
    if (!orderItem) {
      throw new BadRequestException(
        `Order item with ID ${createOrderPlanningDto.orderItemId} not found`,
      );
    }

    // Check if planning already exists for this order item (one-to-one)
    const existingPlanning = await this.orderPlanningModel.findOne({
      where: { orderItemId: createOrderPlanningDto.orderItemId },
    });

    if (existingPlanning) {
      throw new ConflictException(
        `Planning already exists for order item ID ${createOrderPlanningDto.orderItemId}`,
      );
    }

    try {
      const planning = await this.orderPlanningModel.create(
        createOrderPlanningDto as unknown as CreationAttributes<OrderPlanning>,
      );
      return this.findOne(planning.planningId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create order planning');
    }
  }

  async findAll(): Promise<OrderPlanning[]> {
    return this.orderPlanningModel.findAll({
      include: [OrderItem],
      order: [['planningId', 'DESC']],
    });
  }

  async findOne(id: number): Promise<OrderPlanning> {
    const planning = await this.orderPlanningModel.findByPk(id, {
      include: [OrderItem],
    });

    if (!planning) {
      throw new NotFoundException(`Order planning with ID ${id} not found`);
    }

    return planning;
  }

  async findByOrderItem(orderItemId: number): Promise<OrderPlanning> {
    const orderItem = await this.orderItemModel.findByPk(orderItemId);
    if (!orderItem) {
      throw new NotFoundException(
        `Order item with ID ${orderItemId} not found`,
      );
    }

    const planning = await this.orderPlanningModel.findOne({
      where: { orderItemId },
      include: [OrderItem],
    });

    if (!planning) {
      throw new NotFoundException(
        `Order planning for order item ID ${orderItemId} not found`,
      );
    }

    return planning;
  }

  async update(
    id: number,
    updateOrderPlanningDto: UpdateOrderPlanningDto,
  ): Promise<OrderPlanning> {
    const planning = await this.findOne(id);

    try {
      await planning.update(updateOrderPlanningDto as any);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update order planning');
    }
  }

  async remove(id: number): Promise<void> {
    const planning = await this.findOne(id);
    await planning.destroy(); // Hard delete (no soft delete for planning)
  }

  async bulkUpdate(
    orderItemIds: number[],
    updateData: {
      poApprovalDate?: string;
      hotelNeedByDate?: string;
      expectedDelivery?: string;
    },
  ): Promise<{ totalCount: number; results: OrderPlanning[] }> {
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
      await this.orderPlanningModel.bulkCreate(
        orderItemIds.map((orderItemId) => ({
          orderItemId,
          ...updateData,
        })) as any,
        {
          updateOnDuplicate: [
            'poApprovalDate',
            'hotelNeedByDate',
            'expectedDelivery',
            'updatedAt',
          ],
        },
      );

      const results = await this.orderPlanningModel.findAll({
        where: { orderItemId: orderItemIds },
        include: [OrderItem],
        order: [['planningId', 'ASC']],
      });

      return {
        totalCount: results.length,
        results,
      };
    } catch (error) {
      console.error('Bulk update error:', error);
      throw new InternalServerErrorException(
        'Failed to bulk update order planning',
      );
    }
  }
}
