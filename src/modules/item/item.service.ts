import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes, Op } from 'sequelize';
import { Item } from 'src/base/entities/item.entity';
import { ItemCategory } from 'src/base/entities/item-category.entity';
import { Vendor } from 'src/base/entities/vendor.entity';
import { Customer } from 'src/base/entities/customer.entity';
import { Address } from 'src/base/entities/address.entity';
import { OrderPlanning } from 'src/base/entities/order-planning.entity';
import { OrderProduction } from 'src/base/entities/order-production.entity';
import { OrderLogistics } from 'src/base/entities/order-logistics.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item)
    private readonly itemModel: typeof Item,
    @InjectModel(ItemCategory)
    private readonly categoryModel: typeof ItemCategory,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    console.log('📝 Creating item with DTO:', createItemDto);

    // Verify category exists
    const category = await this.categoryModel.findByPk(
      createItemDto.categoryId,
    );
    console.log('📂 Category found:', category?.toJSON());

    if (!category) {
      throw new BadRequestException(
        `Category with ID ${createItemDto.categoryId} not found`,
      );
    }

    try {
      const item = await this.itemModel.create(createItemDto as any);
      console.log('✅ Item created:', item.toJSON());
      return this.findOne(item.itemId);
    } catch (error) {
      console.error('❌ Item creation error:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException(
          'Item with this spec number already exists',
        );
      }
      throw new InternalServerErrorException('Failed to create item');
    }
  }

  async findAll(
    includeRelations = true,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Item[]; meta: any }> {
    const offset = (page - 1) * limit;

    const include = includeRelations
      ? [
          ItemCategory,
          Vendor,
          Customer,
          { model: Address, as: 'vendorAddress' },
          { model: Address, as: 'customerAddress' },
          { model: OrderPlanning, as: 'orderPlanning', required: false },
          { model: OrderProduction, as: 'orderProduction', required: false },
          { model: OrderLogistics, as: 'orderLogistics', required: false },
        ]
      : [ItemCategory];

    const { count, rows } = await this.itemModel.findAndCountAll({
      include,
      limit,
      offset,
      order: [['itemName', 'ASC']],
      distinct: true,
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async search(filterDto: any): Promise<{ data: Item[]; meta: any }> {
    const conditions: any[] = [];

    // Pagination
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const offset = (page - 1) * limit;

    // Phase filter
    if (filterDto.phase !== undefined) {
      conditions.push({ phase: filterDto.phase });
    }

    // Vendor ID filter
    if (filterDto.vendorId) {
      conditions.push({ vendorId: filterDto.vendorId });
    }

    // Customer ID filter
    if (filterDto.customerId) {
      conditions.push({ customerId: filterDto.customerId });
    }

    // Item ID filter
    if (filterDto.itemId) {
      conditions.push({ itemId: filterDto.itemId });
    }

    // Category ID filter
    if (filterDto.categoryId) {
      conditions.push({ categoryId: filterDto.categoryId });
    }

    // Price range filter
    if (filterDto.minPrice !== undefined || filterDto.maxPrice !== undefined) {
      const priceCondition: any = {};
      if (filterDto.minPrice !== undefined) {
        priceCondition[Op.gte] = filterDto.minPrice;
      }
      if (filterDto.maxPrice !== undefined) {
        priceCondition[Op.lte] = filterDto.maxPrice;
      }
      conditions.push({ totalPrice: priceCondition });
    }

    // Search in item name or spec number
    if (filterDto.search) {
      conditions.push({
        [Op.or]: [
          { itemName: { [Op.iLike]: `%${filterDto.search}%` } },
          { specNo: { [Op.iLike]: `%${filterDto.search}%` } },
        ],
      });
    }

    // Item name filter (partial match)
    if (filterDto.itemName && !filterDto.search) {
      conditions.push({ itemName: { [Op.iLike]: `%${filterDto.itemName}%` } });
    }

    // Spec no filter (partial match)
    if (filterDto.specNo && !filterDto.search) {
      conditions.push({ specNo: { [Op.iLike]: `%${filterDto.specNo}%` } });
    }

    const where = conditions.length > 0 ? { [Op.and]: conditions } : {};

    const includeRelations = filterDto.includeRelations !== false;

    const include: any[] = includeRelations
      ? [
          ItemCategory,
          Vendor,
          Customer,
          { model: Address, as: 'vendorAddress' },
          { model: Address, as: 'customerAddress' },
          { model: OrderPlanning, as: 'orderPlanning', required: false },
          { model: OrderProduction, as: 'orderProduction', required: false },
          { model: OrderLogistics, as: 'orderLogistics', required: false },
        ]
      : [ItemCategory, Vendor];

    const { count, rows } = await this.itemModel.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['itemName', 'ASC']],
      distinct: true,
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemModel.findByPk(id, {
      include: [ItemCategory],
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async findBySpecNo(specNo: string): Promise<Item> {
    const item = await this.itemModel.findOne({
      where: { specNo },
      include: [ItemCategory],
    });

    if (!item) {
      throw new NotFoundException(`Item with spec number ${specNo} not found`);
    }

    return item;
  }

  async findByCategory(categoryId: number): Promise<Item[]> {
    const category = await this.categoryModel.findByPk(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return this.itemModel.findAll({
      where: { categoryId },
      include: [ItemCategory],
      order: [['itemName', 'ASC']],
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id);

    // Verify category exists if categoryId is being updated
    if (updateItemDto.categoryId) {
      const category = await this.categoryModel.findByPk(
        updateItemDto.categoryId,
      );
      if (!category) {
        throw new BadRequestException(
          `Category with ID ${updateItemDto.categoryId} not found`,
        );
      }
    }

    try {
      await item.update(updateItemDto);
      return this.findOne(id);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException(
          'Item with this spec number already exists',
        );
      }
      throw new InternalServerErrorException('Failed to update item');
    }
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await item.destroy(); // Soft delete
  }

  async restore(id: number): Promise<Item> {
    const item = await this.itemModel.findByPk(id, {
      paranoid: false,
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    if (!item.deletedAt) {
      throw new ConflictException('Item is not deleted');
    }

    await item.restore();
    return this.findOne(id);
  }

  async bulkUpdate(
    itemIds: number[],
    updateData: {
      categoryId?: number;
      location?: string;
      shipFrom?: string;
      notes?: string;
    },
  ): Promise<{ updatedCount: number; updatedItems: Item[] }> {
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

    // Verify category exists if categoryId is being updated
    if (updateData.categoryId) {
      const category = await this.categoryModel.findByPk(updateData.categoryId);
      if (!category) {
        throw new BadRequestException(
          `Category with ID ${updateData.categoryId} not found`,
        );
      }
    }

    try {
      // Perform bulk update using Sequelize
      const [updatedCount] = await this.itemModel.update(updateData, {
        where: { itemId: itemIds },
      });

      // Fetch updated items
      const updatedItems = await this.itemModel.findAll({
        where: { itemId: itemIds },
        include: [ItemCategory],
        order: [['itemName', 'ASC']],
      });

      return {
        updatedCount,
        updatedItems,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to bulk update items');
    }
  }
}
