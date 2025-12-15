import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seeder } from 'nestjs-seeder';
import { Vendor } from 'src/base/entities/vendor.entity';

@Injectable()
export class VendorsSeeder implements Seeder {
  constructor(
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
  ) {}

  async seed(): Promise<any> {
    const vendors = [
      { vendorName: 'ACME Corporation' },
      { vendorName: 'Global Furniture Ltd' },
      { vendorName: 'Premium Decor Inc' },
      { vendorName: 'Modern Living Co' },
      { vendorName: 'Classic Interiors' },
      { vendorName: 'Urban Design Group' },
    ];

    return this.vendorModel.bulkCreate(vendors as any, {
      ignoreDuplicates: true,
    });
  }

  async drop(): Promise<any> {
    return this.vendorModel.destroy({ where: {}, truncate: true });
  }
}
