import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOrderPlanningDto } from './dto/create-order-planning.dto';
import { UpdateOrderPlanningDto } from './dto/update-order-planning.dto';
import { OrderPlanning } from 'src/base/entities/order-planning.entity';
import { Item } from 'src/base/entities/item.entity';

@Injectable()
export class OrderPlanningService {
  constructor(
    @InjectModel(OrderPlanning)
    private readonly orderPlanningModel: typeof OrderPlanning,
    @InjectModel(Item)
    private readonly itemModel: typeof Item,
  ) {}

  async create(
    createOrderPlanningDto: CreateOrderPlanningDto,
  ): Promise<OrderPlanning> {
    // Verify item exists
    const item = await this.itemModel.findByPk(createOrderPlanningDto.itemId);
    if (!item) {
      throw new BadRequestException(
        `Item with ID ${createOrderPlanningDto.itemId} not found`,
      );
    }

    // Check if planning already exists for this item (one-to-one)
    const existingPlanning = await this.orderPlanningModel.findOne({
      where: { itemId: createOrderPlanningDto.itemId },
    });

    if (existingPlanning) {
      throw new ConflictException(
        `Planning already exists for item ID ${createOrderPlanningDto.itemId}`,
      );
    }

    try {
      const planning = await this.orderPlanningModel.create(
        createOrderPlanningDto as any,
      );
      return this.findOne(planning.planningId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create order planning');
    }
  }

  async findAll(): Promise<OrderPlanning[]> {
    return this.orderPlanningModel.findAll({
      include: [Item],
      order: [['planningId', 'DESC']],
    });
  }

  async findOne(id: number): Promise<OrderPlanning> {
    const planning = await this.orderPlanningModel.findByPk(id, {
      include: [Item],
    });

    if (!planning) {
      throw new NotFoundException(`Order planning with ID ${id} not found`);
    }

    return planning;
  }

  async findByItem(itemId: number): Promise<OrderPlanning> {
    const item = await this.itemModel.findByPk(itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    const planning = await this.orderPlanningModel.findOne({
      where: { itemId },
      include: [Item],
    });

    if (!planning) {
      throw new NotFoundException(
        `Order planning for item ID ${itemId} not found`,
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
    await planning.destroy();
  }

  async bulkUpdate(
    itemIds: number[],
    updateData: {
      sampleApprovedDate?: string;
      piSendDate?: string;
      piApprovedDate?: string;
      initialPaymentDate?: string;
    },
  ): Promise<{ totalCount: number; results: OrderPlanning[] }> {
    // Verify all items exist
    const items = await this.itemModel.findAll({
      where: { itemId: itemIds },
    });

    if (items.length === 0) {
      throw new NotFoundException('No items found with the provided IDs');
    }

    if (items.length !== itemIds.length) {
      const foundIds = items.map((item) => item.itemId);
      const notFoundIds = itemIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(
        `Items not found: ${notFoundIds.join(', ')}`,
      );
    }

    try {
      // Bulk upsert
      await this.orderPlanningModel.bulkCreate(
        itemIds.map((itemId) => ({
          itemId,
          ...updateData,
        })) as any,
        {
          updateOnDuplicate: [
            'sampleApprovedDate',
            'piSendDate',
            'piApprovedDate',
            'initialPaymentDate',
            'updatedAt',
          ],
        },
      );

      // Fetch all results
      const results = await this.orderPlanningModel.findAll({
        where: { itemId: itemIds },
        include: [Item],
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
