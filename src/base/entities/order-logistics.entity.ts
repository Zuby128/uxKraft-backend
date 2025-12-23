import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { Item } from './item.entity';

@Table({
  tableName: 'order_logistics',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class OrderLogistics extends Model<OrderLogistics> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'logistics_id',
  })
  logisticsId: number;

  @Unique
  @ForeignKey(() => Item)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'item_id',
  })
  itemId: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'ordered_date',
  })
  orderedDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'shipped_date',
  })
  shippedDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'delivered_date',
  })
  deliveredDate: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'shipping_notes',
  })
  shippingNotes: string;

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
  @BelongsTo(() => Item)
  item: Item;
}
