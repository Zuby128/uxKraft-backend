import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seeder } from 'nestjs-seeder';
import { VendorAddress } from 'src/base/entities/vendor-address.entity';
import { Vendor } from 'src/base/entities/vendor.entity';

@Injectable()
export class VendorAddressesSeeder implements Seeder {
  constructor(
    @InjectModel(VendorAddress)
    private readonly vendorAddressModel: typeof VendorAddress,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
  ) {}

  async seed(): Promise<any> {
    // Get vendors dynamically
    const acme = await this.vendorModel.findOne({
      where: { vendorName: 'ACME Corporation' },
    });
    const globalFurniture = await this.vendorModel.findOne({
      where: { vendorName: 'Global Furniture Ltd' },
    });
    const premiumDecor = await this.vendorModel.findOne({
      where: { vendorName: 'Premium Decor Inc' },
    });

    if (!acme || !globalFurniture || !premiumDecor) {
      throw new Error('Vendors must be seeded first!');
    }

    const addresses = [
      // ACME Corporation
      {
        vendorId: acme.vendorId,
        title: 'Main Office',
        address: '123 Business Park, New York, NY 10001',
      },
      {
        vendorId: acme.vendorId,
        title: 'Warehouse - East Coast',
        address: '456 Industrial Blvd, Newark, NJ 07102',
      },
      // Global Furniture Ltd
      {
        vendorId: globalFurniture.vendorId,
        title: 'Headquarters',
        address: '789 Commerce Street, Chicago, IL 60601',
      },
      {
        vendorId: globalFurniture.vendorId,
        title: 'Distribution Center',
        address: '321 Logistics Way, Gary, IN 46402',
      },
      // Premium Decor Inc
      {
        vendorId: premiumDecor.vendorId,
        title: 'Corporate Office',
        address: '555 Design Plaza, Los Angeles, CA 90001',
      },
      {
        vendorId: premiumDecor.vendorId,
        title: 'Showroom',
        address: '777 Sunset Boulevard, Beverly Hills, CA 90210',
      },
    ];

    return this.vendorAddressModel.bulkCreate(addresses as any, {
      ignoreDuplicates: true,
    });
  }

  async drop(): Promise<any> {
    return this.vendorAddressModel.destroy({ where: {}, truncate: true });
  }
}
