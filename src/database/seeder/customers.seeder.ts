import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seeder } from 'nestjs-seeder';
import { Customer } from 'src/base/entities/customer.entity';

@Injectable()
export class CustomersSeeder implements Seeder {
  constructor(
    @InjectModel(Customer)
    private readonly customerModel: typeof Customer,
  ) {}

  async seed(): Promise<any> {
    const customers = [
      {
        name: 'Hotel California',
        address: '1 Beach Road, Los Angeles, CA 90001',
      },
      {
        name: 'Grand Resort & Spa',
        address: '200 Ocean Drive, Miami, FL 33139',
      },
      {
        name: 'Downtown Business Center',
        address: '500 5th Avenue, New York, NY 10110',
      },
      {
        name: 'Luxury Suites Hotel',
        address: '100 Park Lane, Chicago, IL 60601',
      },
      {
        name: 'Seaside Inn',
        address: '75 Coastal Highway, San Diego, CA 92101',
      },
    ];

    return this.customerModel.bulkCreate(customers as any, {
      ignoreDuplicates: true,
    });
  }

  async drop(): Promise<any> {
    return this.customerModel.destroy({ where: {}, truncate: true });
  }
}
