import { Sequelize } from 'sequelize-typescript';

export async function seedCustomers(sequelize: Sequelize): Promise<void> {
  console.log('🌱 Seeding customers...');

  const Customer = sequelize.models.Customer;

  const customers = [
    {
      name: 'Hotel California',
      address: '1 Beach Road, Los Angeles, CA 90001',
    },
    { name: 'Grand Resort & Spa', address: '200 Ocean Drive, Miami, FL 33139' },
    {
      name: 'Downtown Business Center',
      address: '500 5th Avenue, New York, NY 10110',
    },
    {
      name: 'Luxury Suites Hotel',
      address: '100 Park Lane, Chicago, IL 60601',
    },
    { name: 'Seaside Inn', address: '75 Coastal Highway, San Diego, CA 92101' },
  ];

  await Customer.bulkCreate(customers as any, {
    ignoreDuplicates: true,
  });

  console.log(`✅ Seeded ${customers.length} customers`);
}
