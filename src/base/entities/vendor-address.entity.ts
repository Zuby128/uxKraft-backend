import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { Vendor } from './vendor.entity';

@Table({
  tableName: 'vendor_addresses',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class VendorAddress extends Model<VendorAddress> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'id',
  })
  id: number;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'vendor_id',
  })
  vendorId: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'title',
  })
  title: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    field: 'address',
  })
  address: string;

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
}
