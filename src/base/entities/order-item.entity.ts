import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasOne,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Vendor } from './vendor.entity';
import { VendorAddress } from './vendor-address.entity';
import { Item } from './item.entity';
import { Customer } from './/customer.entity';
import { OrderPlanning } from './order-planning.entity';
import { OrderProduction } from './order-production.entity';
import { OrderLogistics } from './order-logistics.entity';

@Table({
  tableName: 'order_items',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      fields: ['item_id'],
      name: 'idx_order_items_item',
    },
  ],
})
export class OrderItem extends Model<OrderItem> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'order_item_id',
  })
  orderItemId: number;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'vendor_id',
  })
  vendorId: number;

  @ForeignKey(() => VendorAddress)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'vendor_address',
  })
  vendorAddress: number;

  @ForeignKey(() => Item)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'item_id',
  })
  itemId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'quantity',
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'unit_price',
    comment: 'Price in cents (e.g., 10000 = 100.00)',
  })
  unitPrice: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    field: 'markup_percentage',
    comment: 'Markup percentage (e.g., 15.50 = 15.50%)',
  })
  markupPercentage: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'total_price',
    comment: 'Total price in cents (unit_price + markup) * quantity',
  })
  totalPrice: number;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
    field: 'upload',
  })
  upload: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'phase',
  })
  phase: number;

  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'ship_to',
  })
  shipTo: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at',
  })
  deletedAt: Date;

  // Relations
  @BelongsTo(() => Vendor)
  vendor: Vendor;

  @BelongsTo(() => VendorAddress)
  vendorAddressRelation: VendorAddress;

  @BelongsTo(() => Item)
  item: Item;

  @BelongsTo(() => Customer)
  customer: Customer;

  @HasOne(() => OrderPlanning)
  planning: OrderPlanning;

  @HasOne(() => OrderProduction)
  production: OrderProduction;

  @HasOne(() => OrderLogistics)
  logistics: OrderLogistics;

  // Hooks - Auto calculate total_price
  @BeforeCreate
  @BeforeUpdate
  static calculateTotalPrice(instance: OrderItem) {
    if (
      instance.unitPrice !== undefined &&
      instance.markupPercentage !== undefined &&
      instance.quantity !== undefined
    ) {
      const markupPercentage = parseFloat(instance.markupPercentage.toString());
      const markupAmount = Math.round(
        (instance.unitPrice * markupPercentage) / 100,
      );
      const pricePerUnit = instance.unitPrice + markupAmount;
      instance.totalPrice = pricePerUnit * instance.quantity;
    }
  }
}
