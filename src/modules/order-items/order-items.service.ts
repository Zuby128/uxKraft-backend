import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes, Op } from 'sequelize';
import { OrderItem } from 'src/base/entities/order-item.entity';
import { Item } from 'src/base/entities/item.entity';
import { Vendor } from 'src/base/entities/vendor.entity';
import { VendorAddress } from 'src/base/entities/vendor-address.entity';
import { Customer } from 'src/base/entities/customer.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { FilterOrderItemDto } from './dto/filter-order-item.dto';
import { Upload } from 'src/base/entities/upload.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
    @InjectModel(Item)
    private readonly itemModel: typeof Item,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(VendorAddress)
    private readonly vendorAddressModel: typeof VendorAddress,
    @InjectModel(Customer)
    private readonly customerModel: typeof Customer,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const item = await this.itemModel.findByPk(createOrderItemDto.itemId);
    if (!item) {
      throw new BadRequestException(
        `Item with ID ${createOrderItemDto.itemId} not found`,
      );
    }

    if (createOrderItemDto.vendorId) {
      const vendor = await this.vendorModel.findByPk(
        createOrderItemDto.vendorId,
      );
      if (!vendor) {
        throw new BadRequestException(
          `Vendor with ID ${createOrderItemDto.vendorId} not found`,
        );
      }
    }

    if (createOrderItemDto.vendorAddress) {
      const vendorAddress = await this.vendorAddressModel.findByPk(
        createOrderItemDto.vendorAddress,
      );
      if (!vendorAddress) {
        throw new BadRequestException(
          `Vendor address with ID ${createOrderItemDto.vendorAddress} not found`,
        );
      }
    }

    if (createOrderItemDto.shipTo) {
      const customer = await this.customerModel.findByPk(
        createOrderItemDto.shipTo,
      );
      if (!customer) {
        throw new BadRequestException(
          `Customer with ID ${createOrderItemDto.shipTo} not found`,
        );
      }
    }

    try {
      const orderItem = await this.orderItemModel.create(
        createOrderItemDto as CreationAttributes<OrderItem>,
      );
      return this.findOne(orderItem.orderItemId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create order item');
    }
  }

  async findAll(includeRelations = true): Promise<OrderItem[]> {
    const include = includeRelations
      ? [
          Item,
          Vendor,
          { model: VendorAddress, as: 'vendorAddressRelation' },
          Customer,
          Upload,
        ]
      : [];

    return this.orderItemModel.findAll({
      include,
      order: [['orderItemId', 'DESC']],
    });
  }

  async search(filterDto: FilterOrderItemDto): Promise<OrderItem[]> {
    const where: any = {};
    const itemWhere: any = {};

    if (filterDto.phase !== undefined) {
      where.phase = filterDto.phase;
    }

    if (filterDto.vendorId) {
      where.vendorId = filterDto.vendorId;
    }

    if (filterDto.itemId) {
      where.itemId = filterDto.itemId;
    }

    if (filterDto.customerId) {
      where.shipTo = filterDto.customerId;
    }

    if (filterDto.minPrice !== undefined || filterDto.maxPrice !== undefined) {
      where.totalPrice = {};
      if (filterDto.minPrice !== undefined) {
        where.totalPrice[Op.gte] = filterDto.minPrice;
      }
      if (filterDto.maxPrice !== undefined) {
        where.totalPrice[Op.lte] = filterDto.maxPrice;
      }
    }

    if (filterDto.search) {
      itemWhere[Op.or] = [
        { itemName: { [Op.iLike]: `%${filterDto.search}%` } },
        { specNo: { [Op.iLike]: `%${filterDto.search}%` } },
      ];
    }

    const include: any[] = [
      {
        model: Item,
        as: OrderItem.associations.item.as,
        where: itemWhere,
        required: true,
      },
      Vendor,
      { model: VendorAddress, as: 'vendorAddressRelation' },
      Customer,
      Upload,
    ];

    return this.orderItemModel.findAll({
      logging: console.log,
      where: Object.keys(where).length > 0 ? where : undefined,
      include,
      order: [['orderItemId', 'DESC']],
    });
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemModel.findByPk(id, {
      include: [
        Item,
        Vendor,
        { model: VendorAddress, as: 'vendorAddressRelation' },
        Customer,
        Upload,
      ],
    });

    if (!orderItem) {
      throw new NotFoundException(`Order item with ID ${id} not found`);
    }

    return orderItem;
  }

  async findByItem(itemId: number): Promise<OrderItem[]> {
    const item = await this.itemModel.findByPk(itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    return this.orderItemModel.findAll({
      where: { itemId },
      include: [
        Item,
        Vendor,
        { model: VendorAddress, as: 'vendorAddressRelation' },
        Customer,
        Upload,
      ],
      order: [['orderItemId', 'DESC']],
    });
  }

  async findByVendor(vendorId: number): Promise<OrderItem[]> {
    const vendor = await this.vendorModel.findByPk(vendorId);
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    return this.orderItemModel.findAll({
      where: { vendorId },
      include: [
        Item,
        Vendor,
        { model: VendorAddress, as: 'vendorAddressRelation' },
        Customer,
        Upload,
      ],
      order: [['orderItemId', 'DESC']],
    });
  }

  async findByCustomer(customerId: number): Promise<OrderItem[]> {
    const customer = await this.customerModel.findByPk(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.orderItemModel.findAll({
      where: { shipTo: customerId },
      include: [
        Item,
        Vendor,
        { model: VendorAddress, as: 'vendorAddressRelation' },
        Customer,
        Upload,
      ],
      order: [['orderItemId', 'DESC']],
    });
  }

  async findByPhase(phase: number): Promise<OrderItem[]> {
    return this.orderItemModel.findAll({
      where: { phase },
      include: [
        Item,
        Vendor,
        { model: VendorAddress, as: 'vendorAddressRelation' },
        Customer,
        Upload,
      ],
      order: [['orderItemId', 'DESC']],
    });
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const orderItem = await this.findOne(id);

    // Validate item if being updated
    if (updateOrderItemDto.itemId) {
      const item = await this.itemModel.findByPk(updateOrderItemDto.itemId);
      if (!item) {
        throw new BadRequestException(
          `Item with ID ${updateOrderItemDto.itemId} not found`,
        );
      }
    }

    // Validate vendor if being updated
    if (updateOrderItemDto.vendorId) {
      const vendor = await this.vendorModel.findByPk(
        updateOrderItemDto.vendorId,
      );
      if (!vendor) {
        throw new BadRequestException(
          `Vendor with ID ${updateOrderItemDto.vendorId} not found`,
        );
      }
    }

    // Validate vendor address if being updated
    if (updateOrderItemDto.vendorAddress) {
      const vendorAddress = await this.vendorAddressModel.findByPk(
        updateOrderItemDto.vendorAddress,
      );
      if (!vendorAddress) {
        throw new BadRequestException(
          `Vendor address with ID ${updateOrderItemDto.vendorAddress} not found`,
        );
      }
    }

    // Validate customer if being updated
    if (updateOrderItemDto.shipTo) {
      const customer = await this.customerModel.findByPk(
        updateOrderItemDto.shipTo,
      );
      if (!customer) {
        throw new BadRequestException(
          `Customer with ID ${updateOrderItemDto.shipTo} not found`,
        );
      }
    }

    try {
      await orderItem.update(updateOrderItemDto);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update order item');
    }
  }

  async remove(id: number): Promise<void> {
    const orderItem = await this.findOne(id);
    await orderItem.destroy(); // Soft delete
  }

  async restore(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemModel.findByPk(id, {
      paranoid: false,
    });

    if (!orderItem) {
      throw new NotFoundException(`Order item with ID ${id} not found`);
    }

    if (!orderItem.deletedAt) {
      throw new ConflictException('Order item is not deleted');
    }

    await orderItem.restore();
    return this.findOne(id);
  }
}
