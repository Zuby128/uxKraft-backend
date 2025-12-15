import { Sequelize } from 'sequelize-typescript';

export async function seedVendorAddresses(sequelize: Sequelize): Promise<void> {
  console.log('🌱 Seeding vendor addresses...');

  const VendorAddress = sequelize.models.VendorAddress;
  const Vendor = sequelize.models.Vendor;

  const acme = await Vendor.findOne({
    where: { vendorName: 'ACME Corporation' },
  });
  const global = await Vendor.findOne({
    where: { vendorName: 'Global Furniture Ltd' },
  });

  const addresses = [
    {
      vendorId: acme!.get('vendorId'),
      title: 'Main Office',
      address: '123 Business Park, NY',
    },
    {
      vendorId: acme!.get('vendorId'),
      title: 'Warehouse - East Coast',
      address: '456 Industrial Blvd, NJ',
    },
    {
      vendorId: global!.get('vendorId'),
      title: 'Headquarters',
      address: '789 Commerce St, Chicago',
    },
    {
      vendorId: global!.get('vendorId'),
      title: 'Distribution Center',
      address: '321 Logistics Way, Gary',
    },
  ];

  await VendorAddress.bulkCreate(addresses as any, {
    ignoreDuplicates: true,
  });

  console.log(`✅ Seeded ${addresses.length} vendor addresses`);
}
