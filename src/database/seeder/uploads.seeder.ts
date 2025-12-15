import { Sequelize } from 'sequelize-typescript';

export async function seedUploads(sequelize: Sequelize): Promise<void> {
  console.log('🌱 Seeding uploads...');

  const Upload = sequelize.models.Upload;
  const OrderItem = sequelize.models.OrderItem;

  const items = await OrderItem.findAll({ limit: 2 });

  const uploads = [
    {
      itemId: items[0].get('orderItemId'),
      name: 'PO_001.pdf',
      url: 'https://cdn.example.com/po_001.pdf',
    },
    {
      itemId: items[0].get('orderItemId'),
      name: 'Invoice.pdf',
      url: 'https://cdn.example.com/invoice.pdf',
    },
  ];

  await Upload.bulkCreate(uploads as any, {
    ignoreDuplicates: true,
  });

  console.log(`✅ Seeded ${uploads.length} uploads`);
}
