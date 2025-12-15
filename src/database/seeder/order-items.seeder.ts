import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seeder } from 'nestjs-seeder';
import { OrderItem } from 'src/base/entities/order-item.entity';
import { Vendor } from 'src/base/entities/vendor.entity';
import { VendorAddress } from 'src/base/entities/vendor-address.entity';
import { Item } from 'src/base/entities/item.entity';
import { Customer } from 'src/base/entities/customer.entity';

@Injectable()
export class OrderItemsSeeder implements Seeder {
  constructor(
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(VendorAddress)
    private readonly vendorAddressModel: typeof VendorAddress,
    @InjectModel(Item)
    private readonly itemModel: typeof Item,
    @InjectModel(Customer)
    private readonly customerModel: typeof Customer,
  ) {}

  async seed(): Promise<any> {
    // Get vendors
    const acme = await this.vendorModel.findOne({
      where: { vendorName: 'ACME Corporation' },
    });
    const globalFurniture = await this.vendorModel.findOne({
      where: { vendorName: 'Global Furniture Ltd' },
    });

    // Get vendor addresses
    const acmeMainOffice = await this.vendorAddressModel.findOne({
      where: { vendorId: acme!.vendorId, title: 'Main Office' },
    });
    const globalHQ = await this.vendorAddressModel.findOne({
      where: { vendorId: globalFurniture!.vendorId, title: 'Headquarters' },
    });

    // Get items
    const sofa = await this.itemModel.findOne({
      where: { specNo: 'SOFA-001' },
    });
    const chair = await this.itemModel.findOne({
      where: { specNo: 'CHAIR-001' },
    });
    const table = await this.itemModel.findOne({
      where: { specNo: 'TABLE-001' },
    });
    const chandelier = await this.itemModel.findOne({
      where: { specNo: 'LAMP-001' },
    });
    const deskLamp = await this.itemModel.findOne({
      where: { specNo: 'LAMP-002' },
    });

    // Get customers
    const hotelCA = await this.customerModel.findOne({
      where: { name: 'Hotel California' },
    });
    const grandResort = await this.customerModel.findOne({
      where: { name: 'Grand Resort & Spa' },
    });
    const luxurySuites = await this.customerModel.findOne({
      where: { name: 'Luxury Suites Hotel' },
    });

    if (!acme || !sofa || !hotelCA) {
      throw new Error('Dependencies must be seeded first!');
    }

    const orderItems = [
      // Hotel California Orders
      {
        vendorId: acme.vendorId,
        vendorAddress: acmeMainOffice!.id,
        itemId: sofa.itemId,
        quantity: 15,
        unitPrice: sofa.unitPrice,
        markupPercentage: sofa.markupPercentage,
        shipTo: hotelCA.id,
        phase: 1,
      },
      {
        vendorId: acme.vendorId,
        vendorAddress: acmeMainOffice!.id,
        itemId: chair!.itemId,
        quantity: 30,
        unitPrice: chair!.unitPrice,
        markupPercentage: chair!.markupPercentage,
        shipTo: hotelCA.id,
        phase: 2,
      },
      {
        vendorId: globalFurniture!.vendorId,
        vendorAddress: globalHQ!.id,
        itemId: table!.id,
        quantity: 8,
        unitPrice: table!.unitPrice,
        markupPercentage: table!.markupPercentage,
        shipTo: hotelCA.id,
        phase: 3,
      },
      // Grand Resort Orders
      {
        vendorId: acme.vendorId,
        vendorAddress: acmeMainOffice!.id,
        itemId: chandelier!.itemId,
        quantity: 12,
        unitPrice: chandelier!.unitPrice,
        markupPercentage: chandelier!.markupPercentage,
        shipTo: grandResort!.id,
        phase: 1,
      },
      {
        vendorId: globalFurniture!.vendorId,
        vendorAddress: globalHQ!.id,
        itemId: sofa.itemId,
        quantity: 20,
        unitPrice: sofa.unitPrice,
        markupPercentage: sofa.markupPercentage,
        shipTo: grandResort!.id,
        phase: 2,
      },
      {
        vendorId: acme.vendorId,
        vendorAddress: acmeMainOffice!.id,
        itemId: deskLamp!.itemId,
        quantity: 50,
        unitPrice: deskLamp!.unitPrice,
        markupPercentage: deskLamp!.markupPercentage,
        shipTo: grandResort!.id,
        phase: 3,
      },
      // Luxury Suites Orders
      {
        vendorId: globalFurniture!.vendorId,
        vendorAddress: globalHQ!.id,
        itemId: table!.itemId,
        quantity: 5,
        unitPrice: table!.unitPrice,
        markupPercentage: table!.markupPercentage,
        shipTo: luxurySuites!.id,
        phase: 1,
      },
      {
        vendorId: acme.vendorId,
        vendorAddress: acmeMainOffice!.id,
        itemId: chair!.itemId,
        quantity: 25,
        unitPrice: chair!.unitPrice,
        markupPercentage: chair!.markupPercentage,
        shipTo: luxurySuites!.id,
        phase: 2,
      },
    ];

    return this.orderItemModel.bulkCreate(orderItems as any, {
      ignoreDuplicates: true,
    });
  }

  async drop(): Promise<any> {
    return this.orderItemModel.destroy({ where: {}, truncate: true });
  }
}
