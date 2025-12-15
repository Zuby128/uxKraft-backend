import { Sequelize } from 'sequelize-typescript';

export async function seedOrderProduction(sequelize: Sequelize): Promise<void> {
  console.log('🌱 Seeding order production...');

  const OrderProduction = sequelize.models.OrderProduction;
  const OrderItem = sequelize.models.OrderItem;

  const items = await OrderItem.findAll({ limit: 2 });

  const production = [
    {
      orderItemId: items[0].get('orderItemId'),
      cfaShopsSend: '2024-01-20',
      cfaShopsApproved: '2024-01-25',
    },
  ];

  await OrderProduction.bulkCreate(production as any, {
    ignoreDuplicates: true,
  });

  console.log(`✅ Seeded ${production.length} order production records`);
}
