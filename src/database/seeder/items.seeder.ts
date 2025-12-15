import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seeder } from 'nestjs-seeder';
import { ItemCategory } from 'src/base/entities/item-category.entity';
import { Item } from 'src/base/entities/item.entity';

@Injectable()
export class ItemsSeeder implements Seeder {
  constructor(
    @InjectModel(Item)
    private readonly itemModel: typeof Item,
    @InjectModel(ItemCategory)
    private readonly categoryModel: typeof ItemCategory,
  ) {}

  async seed(): Promise<any> {
    // Get categories dynamically
    const furniture = await this.categoryModel.findOne({
      where: { name: 'Furniture' },
    });
    const lighting = await this.categoryModel.findOne({
      where: { name: 'Lighting' },
    });
    const decor = await this.categoryModel.findOne({
      where: { name: 'Decor' },
    });
    const textiles = await this.categoryModel.findOne({
      where: { name: 'Textiles' },
    });

    if (!furniture || !lighting || !decor || !textiles) {
      throw new Error('Categories must be seeded first!');
    }

    const items = [
      // Furniture
      {
        specNo: 'SOFA-001',
        itemName: 'Premium Leather Sofa',
        description: 'Luxury 3-seater leather sofa',
        categoryId: furniture.categoryId,
        unitType: 'each',
        location: 'Warehouse A, Section 1',
        shipFrom: 'New York Distribution Center',
        unitPrice: 150000, // $1,500.00
        markupPercentage: 20,
        notes: 'Handle with care',
      },
      {
        specNo: 'CHAIR-001',
        itemName: 'Executive Office Chair',
        description: 'Ergonomic leather office chair',
        categoryId: furniture.categoryId,
        unitType: 'each',
        location: 'Warehouse A, Section 2',
        shipFrom: 'Chicago Distribution Center',
        unitPrice: 45000, // $450.00
        markupPercentage: 25,
      },
      {
        specNo: 'TABLE-001',
        itemName: 'Conference Table',
        description: 'Oak wood conference table 8-seater',
        categoryId: furniture.categoryId,
        unitType: 'each',
        location: 'Warehouse B, Section 1',
        shipFrom: 'New York Distribution Center',
        unitPrice: 280000, // $2,800.00
        markupPercentage: 15,
      },
      // Lighting
      {
        specNo: 'LAMP-001',
        itemName: 'Crystal Chandelier',
        description: 'Modern crystal chandelier',
        categoryId: lighting.categoryId,
        unitType: 'each',
        location: 'Warehouse C, Section 3',
        shipFrom: 'Los Angeles Distribution Center',
        unitPrice: 95000, // $950.00
        markupPercentage: 30,
      },
      {
        specNo: 'LAMP-002',
        itemName: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp',
        categoryId: lighting.categoryId,
        unitType: 'each',
        location: 'Warehouse A, Section 4',
        shipFrom: 'Chicago Distribution Center',
        unitPrice: 8000, // $80.00
        markupPercentage: 40,
      },
      // Decor
      {
        specNo: 'DECOR-001',
        itemName: 'Modern Wall Art',
        description: 'Abstract canvas wall art 48x36',
        categoryId: decor.categoryId,
        unitType: 'each',
        location: 'Warehouse B, Section 5',
        shipFrom: 'New York Distribution Center',
        unitPrice: 35000, // $350.00
        markupPercentage: 50,
      },
      {
        specNo: 'VASE-001',
        itemName: 'Ceramic Floor Vase',
        description: 'Large decorative ceramic vase',
        categoryId: decor.categoryId,
        unitType: 'each',
        location: 'Warehouse C, Section 2',
        shipFrom: 'Los Angeles Distribution Center',
        unitPrice: 12000, // $120.00
        markupPercentage: 35,
      },
      // Textiles
      {
        specNo: 'CURT-001',
        itemName: 'Blackout Curtains',
        description: 'Premium blackout curtains 96" length',
        categoryId: textiles.categoryId,
        unitType: 'pair',
        location: 'Warehouse A, Section 6',
        shipFrom: 'Chicago Distribution Center',
        unitPrice: 18000, // $180.00
        markupPercentage: 30,
      },
      {
        specNo: 'RUG-001',
        itemName: 'Persian Area Rug',
        description: 'Hand-woven Persian rug 8x10',
        categoryId: textiles.categoryId,
        unitType: 'each',
        location: 'Warehouse B, Section 3',
        shipFrom: 'New York Distribution Center',
        unitPrice: 450000, // $4,500.00
        markupPercentage: 20,
      },
    ];

    return this.itemModel.bulkCreate(items as any, {
      ignoreDuplicates: true,
    });
  }

  async drop(): Promise<any> {
    return this.itemModel.destroy({ where: {}, truncate: true });
  }
}
