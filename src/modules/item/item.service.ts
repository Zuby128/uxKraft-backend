import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from 'src/base/entities/item.entity';
import { ItemCategory } from 'src/base/entities/item-category.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item)
    private readonly itemModel: typeof Item,
    @InjectModel(ItemCategory)
    private readonly categoryModel: typeof ItemCategory,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    // Verify category exists
    const category = await this.categoryModel.findByPk(
      createItemDto.categoryId,
    );
    if (!category) {
      throw new BadRequestException(
        `Category with ID ${createItemDto.categoryId} not found`,
      );
    }

    try {
      const item = await this.itemModel.create(
        createItemDto as CreationAttributes<Item>,
      );
      return this.findOne(item.itemId);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException(
          'Item with this spec number already exists',
        );
      }
      throw new InternalServerErrorException('Failed to create item');
    }
  }

  async findAll(includeCategory = true): Promise<Item[]> {
    return this.itemModel.findAll({
      include: includeCategory ? [ItemCategory] : [],
      order: [['itemName', 'ASC']],
    });
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
}
