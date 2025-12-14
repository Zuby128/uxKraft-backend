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
} from 'sequelize-typescript';
import { OrderItem } from './order-item.entity';

@Table({
  tableName: 'order_logistics',
  timestamps: true,
  paranoid: false,
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
  @ForeignKey(() => OrderItem)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'order_item_id',
  })
  orderItemId: number;

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

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'phase',
  })
  phase: number;

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

  // Relations
  @BelongsTo(() => OrderItem)
  orderItem: OrderItem;
}
