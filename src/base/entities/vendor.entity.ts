import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
} from 'sequelize-typescript';
import { VendorAddress } from './vendor-address.entity';
import { OrderItem } from './order-item.entity';

@Table({
  tableName: 'vendors',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['vendor_name'],
      name: 'idx_vendors_name',
    },
  ],
})
export class Vendor extends Model<Vendor> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'vendor_id',
  })
  vendorId: number;

  @Unique
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'vendor_name',
  })
  vendorName: string;

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
  @HasMany(() => VendorAddress)
  addresses: VendorAddress[];

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}
