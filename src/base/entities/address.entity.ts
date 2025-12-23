import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Index,
} from 'sequelize-typescript';

@Table({
  tableName: 'addresses',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      fields: ['type'],
      name: 'idx_address_type',
    },
    {
      fields: ['type', 'reference_id'],
      name: 'idx_address_reference',
    },
  ],
})
export class Address extends Model<Address> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'address_id',
  })
  addressId: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'title',
    comment: 'e.g., Main Office, Warehouse, Delivery Address',
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'address',
  })
  address: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'type',
    comment: 'vendor or customer',
  })
  type: 'vendor' | 'customer';

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'reference_id',
    comment: 'vendor_id or customer_id depending on type',
  })
  referenceId: number;

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
}
