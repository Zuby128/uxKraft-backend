import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ItemCategory } from 'src/base/entities/item-category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class ItemCategoryService {
  constructor(
    @InjectModel(ItemCategory)
    private readonly categoryModel: typeof ItemCategory,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<ItemCategory> {
    try {
      const category = await this.categoryModel.create(
        createCategoryDto as CreationAttributes<ItemCategory>,
      );
      return category;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Category with this name already exists');
      }
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll(): Promise<ItemCategory[]> {
    return this.categoryModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number): Promise<ItemCategory> {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ItemCategory> {
    const category = await this.findOne(id);

    try {
      await category.update(updateCategoryDto);
      return category;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Category with this name already exists');
      }
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await category.destroy(); // Soft delete
  }

  async restore(id: number): Promise<ItemCategory> {
    const category = await this.categoryModel.findByPk(id, {
      paranoid: false, // Include soft-deleted records
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (!category.deletedAt) {
      throw new ConflictException('Category is not deleted');
    }

    await category.restore();
    return category;
  }
}
