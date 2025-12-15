import { Sequelize } from 'sequelize-typescript';

export async function seedCategories(sequelize: Sequelize): Promise<void> {
  console.log('🌱 Seeding categories...');

  // Get model from the sequelize instance
  const ItemCategory = sequelize.models.ItemCategory;

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

  await ItemCategory.bulkCreate(categories as any, {
    ignoreDuplicates: true,
  });

  console.log(`✅ Seeded ${categories.length} categories`);
}
