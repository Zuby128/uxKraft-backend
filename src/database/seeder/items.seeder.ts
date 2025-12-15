import { Sequelize } from 'sequelize-typescript';

export async function seedItems(sequelize: Sequelize): Promise<void> {
  console.log('🌱 Seeding items...');

  const Item = sequelize.models.Item;
  const ItemCategory = sequelize.models.ItemCategory;

  // Get categories dynamically
  const furniture = await ItemCategory.findOne({
    where: { name: 'Furniture' },
  });
  const lighting = await ItemCategory.findOne({ where: { name: 'Lighting' } });
  const decor = await ItemCategory.findOne({ where: { name: 'Decor' } });
  const textiles = await ItemCategory.findOne({ where: { name: 'Textiles' } });

  const items = [
    {
      specNo: 'SOFA-001',
      itemName: 'Premium Leather Sofa',
      categoryId: furniture!.get('categoryId'),
      unitPrice: 150000,
      markupPercentage: 20,
      totalPrice: 150000 * (1 + 20 / 100),
      location: 'Warehouse A',
      shipFrom: 'New York',
    },
    {
      specNo: 'CHAIR-001',
      itemName: 'Executive Office Chair',
      categoryId: furniture!.get('categoryId'),
      unitPrice: 45000,
      markupPercentage: 25,
      totalPrice: 45000 * (1 + 25 / 100),
      location: 'Warehouse A',
      shipFrom: 'Chicago',
    },
    {
      specNo: 'TABLE-001',
      itemName: 'Conference Table',
      categoryId: furniture!.get('categoryId'),
      unitPrice: 280000,
      markupPercentage: 15,
      totalPrice: 280000 * (1 + 15 / 100),
      location: 'Warehouse B',
      shipFrom: 'New York',
    },
    {
      specNo: 'LAMP-001',
      itemName: 'Crystal Chandelier',
      categoryId: lighting!.get('categoryId'),
      unitPrice: 95000,
      markupPercentage: 30,
      totalPrice: 95000 * (1 + 30 / 100),
      location: 'Warehouse C',
      shipFrom: 'LA',
    },
    {
      specNo: 'LAMP-002',
      itemName: 'LED Desk Lamp',
      categoryId: lighting!.get('categoryId'),
      unitPrice: 8000,
      markupPercentage: 40,
      totalPrice: 8000 * (1 + 40 / 100),
      location: 'Warehouse A',
      shipFrom: 'Chicago',
    },
    {
      specNo: 'DECOR-001',
      itemName: 'Modern Wall Art',
      categoryId: decor!.get('categoryId'),
      unitPrice: 35000,
      markupPercentage: 50,
      totalPrice: 35000 * (1 + 50 / 100),
      location: 'Warehouse B',
      shipFrom: 'New York',
    },
    {
      specNo: 'VASE-001',
      itemName: 'Ceramic Floor Vase',
      categoryId: decor!.get('categoryId'),
      unitPrice: 12000,
      markupPercentage: 35,
      totalPrice: 12000 * (1 + 35 / 100),
      location: 'Warehouse C',
      shipFrom: 'LA',
    },
    {
      specNo: 'CURT-001',
      itemName: 'Blackout Curtains',
      categoryId: textiles!.get('categoryId'),
      unitPrice: 18000,
      markupPercentage: 30,
      totalPrice: 18000 * (1 + 30 / 100),
      unitType: 'pair',
      location: 'Warehouse A',
      shipFrom: 'Chicago',
    },
    {
      specNo: 'RUG-001',
      itemName: 'Persian Area Rug',
      categoryId: textiles!.get('categoryId'),
      unitPrice: 450000,
      markupPercentage: 20,
      totalPrice: 450000 * (1 + 20 / 100),
      location: 'Warehouse B',
      shipFrom: 'New York',
    },
  ];

  await Item.bulkCreate(items as any, {
    ignoreDuplicates: true,
  });

  console.log(`✅ Seeded ${items.length} items`);
}
