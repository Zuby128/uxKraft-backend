import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOrderProductionDto } from './dto/create-order-production.dto';
import { UpdateOrderProductionDto } from './dto/update-order-production.dto';
import { OrderProduction } from 'src/base/entities/order-production.entity';
import { Item } from 'src/base/entities/item.entity';

@Injectable()
export class OrderProductionService {
  constructor(
    @InjectModel(OrderProduction)
    private readonly orderProductionModel: typeof OrderProduction,
    @InjectModel(Item)
    private readonly itemModel: typeof Item,
  ) {}

  async create(
    createOrderProductionDto: CreateOrderProductionDto,
  ): Promise<OrderProduction> {
    // Verify item exists
    const item = await this.itemModel.findByPk(createOrderProductionDto.itemId);
    if (!item) {
      throw new BadRequestException(
        `Item with ID ${createOrderProductionDto.itemId} not found`,
      );
    }

    // Check if production already exists for this item (one-to-one)
    const existingProduction = await this.orderProductionModel.findOne({
      where: { itemId: createOrderProductionDto.itemId },
    });

    if (existingProduction) {
      throw new ConflictException(
        `Production already exists for item ID ${createOrderProductionDto.itemId}`,
      );
    }

    try {
      const production = await this.orderProductionModel.create(
        createOrderProductionDto as any,
      );
      return this.findOne(production.productionId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create order production',
      );
    }
  }

  async findAll(): Promise<OrderProduction[]> {
    return this.orderProductionModel.findAll({
      include: [Item],
      order: [['productionId', 'DESC']],
    });
  }

  async findOne(id: number): Promise<OrderProduction> {
    const production = await this.orderProductionModel.findByPk(id, {
      include: [Item],
    });

    if (!production) {
      throw new NotFoundException(`Order production with ID ${id} not found`);
    }

    return production;
  }

  async findByItem(itemId: number): Promise<OrderProduction> {
    const item = await this.itemModel.findByPk(itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    const production = await this.orderProductionModel.findOne({
      where: { itemId },
      include: [Item],
    });

    if (!production) {
      throw new NotFoundException(
        `Order production for item ID ${itemId} not found`,
      );
    }

    return production;
  }

  async update(
    id: number,
    updateOrderProductionDto: UpdateOrderProductionDto,
  ): Promise<OrderProduction> {
    const production = await this.findOne(id);

    try {
      await production.update(updateOrderProductionDto as any);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update order production',
      );
    }
  }

  async remove(id: number): Promise<void> {
    const production = await this.findOne(id);
    await production.destroy();
  }

  async bulkUpdate(
    bulkUpdateDto: any,
  ): Promise<{ totalCount: number; results: OrderProduction[] }> {
    const { itemIds, ...updateData } = bulkUpdateDto;

    // Verify all items exist
    const items = await this.itemModel.findAll({
      where: { itemId: itemIds },
    });

    if (items.length === 0) {
      throw new NotFoundException('No items found with the provided IDs');
    }

    if (items.length !== itemIds.length) {
      const foundIds = items.map((item) => item.itemId);
      const notFoundIds = itemIds.filter((id: any) => !foundIds.includes(id));
      throw new BadRequestException(
        `Items not found: ${notFoundIds.join(', ')}`,
      );
    }

    try {
      // Bulk upsert
      await this.orderProductionModel.bulkCreate(
        itemIds.map((itemId: any) => ({
          itemId,
          ...updateData,
        })) as any,
        {
          updateOnDuplicate: [
            'cfaShopsSend',
            'cfaShopsApproved',
            'cfaShopsDelivered',
            'updatedAt',
          ],
        },
      );

      // Fetch all results
      const results = await this.orderProductionModel.findAll({
        where: { itemId: itemIds },
        include: [Item],
        order: [['productionId', 'ASC']],
      });

      return {
        totalCount: results.length,
        results,
      };
    } catch (error) {
      console.error('Bulk update error:', error);
      throw new InternalServerErrorException(
        'Failed to bulk update order production',
      );
    }
  }
}
