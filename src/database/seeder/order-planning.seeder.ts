import { Sequelize } from 'sequelize-typescript';

export async function seedOrderPlanning(sequelize: Sequelize): Promise<void> {
  console.log('🌱 Seeding order planning...');

  const OrderPlanning = sequelize.models.OrderPlanning;
  const OrderItem = sequelize.models.OrderItem;

  const items = await OrderItem.findAll({ limit: 3 });

  const planning = [
    {
      orderItemId: items[0].get('orderItemId'),
      poApprovalDate: '2024-01-10',
      hotelNeedByDate: '2024-02-15',
      expectedDelivery: '2024-02-10',
    },
    {
      orderItemId: items[1].get('orderItemId'),
      poApprovalDate: '2024-01-12',
      hotelNeedByDate: '2024-02-20',
      expectedDelivery: '2024-02-15',
    },
  ];

  await OrderPlanning.bulkCreate(planning as any, {
    ignoreDuplicates: true,
  });

  console.log(`✅ Seeded ${planning.length} order planning records`);
}
