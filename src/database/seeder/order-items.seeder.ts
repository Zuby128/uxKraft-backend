import { Sequelize } from 'sequelize-typescript';

export async function seedOrderItems(sequelize: Sequelize): Promise<void> {
  console.log('🌱 Seeding order items...');

  const OrderItem = sequelize.models.OrderItem;
  const Vendor = sequelize.models.Vendor;
  const VendorAddress = sequelize.models.VendorAddress;
  const Item = sequelize.models.Item;
  const Customer = sequelize.models.Customer;

  const acme = await Vendor.findOne({
    where: { vendorName: 'ACME Corporation' },
  });
  const acmeOffice = await VendorAddress.findOne({
    where: { title: 'Main Office' },
  });
  const sofa = await Item.findOne({ where: { specNo: 'SOFA-001' } });
  const chair = await Item.findOne({ where: { specNo: 'CHAIR-001' } });
  const hotelCA = await Customer.findOne({
    where: { name: 'Hotel California' },
  });
  const grandResort = await Customer.findOne({
    where: { name: 'Grand Resort & Spa' },
  });

  const sofaUnitPrice = sofa!.get('unitPrice') as number;
  const sofaMarkup = sofa!.get('markupPercentage') as number;
  const chairUnitPrice = chair!.get('unitPrice') as number;
  const chairMarkup = chair!.get('markupPercentage') as number;

  const orderItems = [
    {
      vendorId: acme!.get('vendorId'),
      vendorAddress: acmeOffice!.get('addressId'),
      itemId: sofa!.get('itemId'),
      quantity: 15,
      unitPrice: sofaUnitPrice,
      markupPercentage: sofaMarkup,
      totalPrice: 15 * sofaUnitPrice * (1 + sofaMarkup / 100),
      shipTo: hotelCA!.get('id'),
      phase: 1,
    },
    {
      vendorId: acme!.get('vendorId'),
      vendorAddress: acmeOffice!.get('addressId'),
      itemId: chair!.get('itemId'),
      quantity: 30,
      unitPrice: chairUnitPrice,
      markupPercentage: chairMarkup,
      totalPrice: 30 * chairUnitPrice * (1 + chairMarkup / 100),
      shipTo: hotelCA!.get('id'),
      phase: 2,
    },
    {
      vendorId: acme!.get('vendorId'),
      vendorAddress: acmeOffice!.get('addressId'),
      itemId: sofa!.get('itemId'),
      quantity: 20,
      unitPrice: sofaUnitPrice,
      markupPercentage: sofaMarkup,
      totalPrice: 20 * sofaUnitPrice * (1 + sofaMarkup / 100),
      shipTo: grandResort!.get('id'),
      phase: 3,
    },
  ];

  await OrderItem.bulkCreate(orderItems as any, {
    ignoreDuplicates: true,
  });

  console.log(`✅ Seeded ${orderItems.length} order items`);
}
