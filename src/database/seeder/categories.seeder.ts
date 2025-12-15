import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seeder } from 'nestjs-seeder';
import { ItemCategory } from 'src/base/entities/item-category.entity';

@Injectable()
export class CategoriesSeeder implements Seeder {
  constructor(
    @InjectModel(ItemCategory)
    private readonly categoryModel: typeof ItemCategory,
  ) {}

  async seed(): Promise<any> {
    const categories = [
      { name: 'Furniture' },
      { name: 'Lighting' },
      { name: 'Decor' },
      { name: 'Textiles' },
      { name: 'Artwork' },
      { name: 'Office Equipment' },
      { name: 'Kitchen & Dining' },
      { name: 'Outdoor' },
    ];

    return this.categoryModel.bulkCreate(categories as any, {
      ignoreDuplicates: true,
    });
  }

  async drop(): Promise<any> {
    return this.categoryModel.destroy({ where: {}, truncate: true });
  }
}
