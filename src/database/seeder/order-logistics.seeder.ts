import { Sequelize } from 'sequelize-typescript';

export async function seedOrderLogistics(sequelize: Sequelize): Promise<void> {
  console.log('🌱 Seeding order logistics...');

  const OrderLogistics = sequelize.models.OrderLogistics;
  const OrderItem = sequelize.models.OrderItem;

  const items = await OrderItem.findAll({ limit: 2 });

  const logistics = [
    {
      orderItemId: items[0].get('orderItemId'),
      orderedDate: '2024-02-06',
      shippedDate: '2024-02-08',
      shippingNotes: 'Standard shipping',
    },
  ];

  await OrderLogistics.bulkCreate(logistics as any, {
    ignoreDuplicates: true,
  });

  console.log(`✅ Seeded ${logistics.length} order logistics records`);
}
