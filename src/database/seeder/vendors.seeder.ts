import { Sequelize } from 'sequelize-typescript';

export async function seedVendors(sequelize: Sequelize): Promise<void> {
  console.log('🌱 Seeding vendors...');

  const Vendor = sequelize.models.Vendor;

  const vendors = [
    { vendorName: 'ACME Corporation' },
    { vendorName: 'Global Furniture Ltd' },
    { vendorName: 'Premium Decor Inc' },
    { vendorName: 'Modern Living Co' },
    { vendorName: 'Classic Interiors' },
    { vendorName: 'Urban Design Group' },
  ];

  await Vendor.bulkCreate(vendors as any, {
    ignoreDuplicates: true,
  });

  console.log(`✅ Seeded ${vendors.length} vendors`);
}
