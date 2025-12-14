import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { CreateOrderProductionDto } from './dto/create-order-production.dto';
import { UpdateOrderProductionDto } from './dto/update-order-production.dto';
import { OrderProduction } from 'src/base/entities/order-production.entity';
import { OrderItem } from 'src/base/entities/order-item.entity';

@Injectable()
export class OrderProductionService {
  constructor(
    @InjectModel(OrderProduction)
    private readonly orderProductionModel: typeof OrderProduction,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async create(
    createOrderProductionDto: CreateOrderProductionDto,
  ): Promise<OrderProduction> {
    // Verify order item exists
    const orderItem = await this.orderItemModel.findByPk(
      createOrderProductionDto.orderItemId,
    );
    if (!orderItem) {
      throw new BadRequestException(
        `Order item with ID ${createOrderProductionDto.orderItemId} not found`,
      );
    }

    // Check if production already exists for this order item (one-to-one)
    const existingProduction = await this.orderProductionModel.findOne({
      where: { orderItemId: createOrderProductionDto.orderItemId },
    });

    if (existingProduction) {
      throw new ConflictException(
        `Production already exists for order item ID ${createOrderProductionDto.orderItemId}`,
      );
    }

    try {
      const production = await this.orderProductionModel.create(
        createOrderProductionDto as unknown as CreationAttributes<OrderProduction>,
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
      include: [OrderItem],
      order: [['productionId', 'DESC']],
    });
  }

  async findOne(id: number): Promise<OrderProduction> {
    const production = await this.orderProductionModel.findByPk(id, {
      include: [OrderItem],
    });

    if (!production) {
      throw new NotFoundException(`Order production with ID ${id} not found`);
    }

    return production;
  }

  async findByOrderItem(orderItemId: number): Promise<OrderProduction> {
    const orderItem = await this.orderItemModel.findByPk(orderItemId);
    if (!orderItem) {
      throw new NotFoundException(
        `Order item with ID ${orderItemId} not found`,
      );
    }

    const production = await this.orderProductionModel.findOne({
      where: { orderItemId },
      include: [OrderItem],
    });

    if (!production) {
      throw new NotFoundException(
        `Order production for order item ID ${orderItemId} not found`,
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
    await production.destroy(); // Hard delete (no soft delete for production)
  }
}
