import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  ForeignKey,
  BelongsTo,
  HasOne,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeValidate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { ItemCategory } from './item-category.entity';
import { Vendor } from './vendor.entity';
import { Customer } from './customer.entity';
import { Address } from './address.entity';
import { OrderPlanning } from './order-planning.entity';
import { OrderProduction } from './order-production.entity';
import { OrderLogistics } from './order-logistics.entity';

@Table({
  tableName: 'items',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['spec_no'],
      name: 'idx_items_spec_no',
    },
    {
      fields: ['category_id'],
      name: 'idx_items_category',
    },
    {
      fields: ['item_name'],
      name: 'idx_items_name',
    },
    {
      fields: ['vendor_id'],
      name: 'idx_items_vendor',
    },
    {
      fields: ['customer_id'],
      name: 'idx_items_customer',
    },
  ],
})
export class Item extends Model<Item> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'item_id',
  })
  itemId: number;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'spec_no',
  })
  specNo: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'item_name',
  })
  itemName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'description',
  })
  description: string;

  @ForeignKey(() => ItemCategory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'category_id',
  })
  categoryId: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'each',
    field: 'unit_type',
  })
  unitType: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  notes: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'location',
  })
  location: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'ship_from',
  })
  shipFrom: string;

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
    comment: 'Total price in cents (e.g., 11550 = 115.50)',
  })
  totalPrice: number;

  // ========== ORDER FIELDS (moved from order_items) ==========

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'quantity',
  })
  quantity: number;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'vendor_id',
  })
  vendorId: number;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'vendor_address_id',
    comment: 'FK to addresses table (type=vendor)',
  })
  vendorAddressId: number;

  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'customer_id',
  })
  customerId: number;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'customer_address_id',
    comment: 'FK to addresses table (type=customer)',
  })
  customerAddressId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'phase',
    comment: '0=planning, 1=production, 2=logistics, 3=delivered',
  })
  phase: number;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
    field: 'upload',
  })
  upload: string[];

  // ========== END ORDER FIELDS ==========

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
  @BelongsTo(() => ItemCategory)
  category: ItemCategory;

  @BelongsTo(() => Vendor)
  vendor: Vendor;

  @BelongsTo(() => Customer)
  customer: Customer;

  @BelongsTo(() => Address, 'vendorAddressId')
  vendorAddress: Address;

  @BelongsTo(() => Address, 'customerAddressId')
  customerAddress: Address;

  @HasOne(() => OrderPlanning)
  orderPlanning: OrderPlanning;

  @HasOne(() => OrderProduction)
  orderProduction: OrderProduction;

  @HasOne(() => OrderLogistics)
  orderLogistics: OrderLogistics;

  // Hooks - Auto calculate total_price
  @BeforeValidate
  @BeforeUpdate
  static calculateTotalPrice(instance: Item) {
    if (
      instance.unitPrice !== undefined &&
      instance.markupPercentage !== undefined
    ) {
      const markupPercentage = parseFloat(instance.markupPercentage.toString());
      const markupAmount = Math.round(
        (instance.unitPrice * markupPercentage) / 100,
      );
      instance.totalPrice = instance.unitPrice + markupAmount;
    }
  }
}
