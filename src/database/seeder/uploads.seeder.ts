import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seeder } from 'nestjs-seeder';
import { Upload } from 'src/base/entities/upload.entity';
import { OrderItem } from 'src/base/entities/order-item.entity';

@Injectable()
export class UploadsSeeder implements Seeder {
  constructor(
    @InjectModel(Upload)
    private readonly uploadModel: typeof Upload,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async seed(): Promise<any> {
    // Get first 4 order items
    const orderItems = await this.orderItemModel.findAll({
      limit: 4,
      order: [['orderItemId', 'ASC']],
    });

    if (orderItems.length === 0) {
      throw new Error('OrderItems must be seeded first!');
    }

    const uploads = [
      // Order 1 uploads
      {
        itemId: orderItems[0].orderItemId,
        name: 'Purchase_Order_001.pdf',
        url: 'https://cdn.example.com/documents/po_001.pdf',
      },
      {
        itemId: orderItems[0].orderItemId,
        name: 'Product_Specification.pdf',
        url: 'https://cdn.example.com/documents/spec_sofa_001.pdf',
      },
      {
        itemId: orderItems[0].orderItemId,
        name: 'Delivery_Receipt.jpg',
        url: 'https://cdn.example.com/images/receipt_001.jpg',
      },
      // Order 2 uploads
      {
        itemId: orderItems[1].orderItemId,
        name: 'Invoice_12345.pdf',
        url: 'https://cdn.example.com/documents/invoice_12345.pdf',
      },
      {
        itemId: orderItems[1].orderItemId,
        name: 'Quality_Certificate.pdf',
        url: 'https://cdn.example.com/documents/cert_chair_001.pdf',
      },
      // Order 3 uploads
      {
        itemId: orderItems[2].orderItemId,
        name: 'CAD_Drawing.dwg',
        url: 'https://cdn.example.com/drawings/table_001.dwg',
      },
      {
        itemId: orderItems[2].orderItemId,
        name: 'Material_Samples.jpg',
        url: 'https://cdn.example.com/images/samples_table.jpg',
      },
      // Order 4 uploads
      {
        itemId: orderItems[3].orderItemId,
        name: 'Shipping_Label.pdf',
        url: 'https://cdn.example.com/documents/label_001.pdf',
      },
    ];

    return this.uploadModel.bulkCreate(uploads as any, {
      ignoreDuplicates: true,
    });
  }

  async drop(): Promise<any> {
    return this.uploadModel.destroy({ where: {}, truncate: true });
  }
}
