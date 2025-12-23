import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOrderLogisticsDto } from './dto/create-order-logistics.dto';
import { UpdateOrderLogisticsDto } from './dto/update-order-logistics.dto';
import { OrderLogistics } from 'src/base/entities/order-logistics.entity';
import { Item } from 'src/base/entities/item.entity';

@Injectable()
export class OrderLogisticsService {
  constructor(
    @InjectModel(OrderLogistics)
    private readonly orderLogisticsModel: typeof OrderLogistics,
    @InjectModel(Item)
    private readonly itemModel: typeof Item,
  ) {}

  async create(
    createOrderLogisticsDto: CreateOrderLogisticsDto,
  ): Promise<OrderLogistics> {
    // Verify item exists
    const item = await this.itemModel.findByPk(createOrderLogisticsDto.itemId);
    if (!item) {
      throw new BadRequestException(
        `Item with ID ${createOrderLogisticsDto.itemId} not found`,
      );
    }

    // Check if logistics already exists for this item (one-to-one)
    const existingLogistics = await this.orderLogisticsModel.findOne({
      where: { itemId: createOrderLogisticsDto.itemId },
    });

    if (existingLogistics) {
      throw new ConflictException(
        `Logistics already exists for item ID ${createOrderLogisticsDto.itemId}`,
      );
    }

    try {
      const logistics = await this.orderLogisticsModel.create(
        createOrderLogisticsDto as any,
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
      include: [Item],
      order: [['logisticsId', 'DESC']],
    });
  }

  async findOne(id: number): Promise<OrderLogistics> {
    const logistics = await this.orderLogisticsModel.findByPk(id, {
      include: [Item],
    });

    if (!logistics) {
      throw new NotFoundException(`Order logistics with ID ${id} not found`);
    }

    return logistics;
  }

  async findByItem(itemId: number): Promise<OrderLogistics> {
    const item = await this.itemModel.findByPk(itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    const logistics = await this.orderLogisticsModel.findOne({
      where: { itemId },
      include: [Item],
    });

    if (!logistics) {
      throw new NotFoundException(
        `Order logistics for item ID ${itemId} not found`,
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
    await logistics.destroy();
  }

  async bulkUpdate(
    itemIds: number[],
    updateData: {
      orderedDate?: string;
      shippedDate?: string;
      deliveredDate?: string;
      shippingNotes?: string;
    },
  ): Promise<{ totalCount: number; results: OrderLogistics[] }> {
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
      await this.orderLogisticsModel.bulkCreate(
        itemIds.map((itemId) => ({
          itemId,
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

      // Fetch all results
      const results = await this.orderLogisticsModel.findAll({
        where: { itemId: itemIds },
        include: [Item],
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
