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
  tableName: 'order_production',
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export class OrderProduction extends Model<OrderProduction> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'production_id',
  })
  productionId: number;

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
    field: 'cfa_shops_send',
  })
  cfaShopsSend: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'cfa_shops_approved',
  })
  cfaShopsApproved: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'cfa_shops_delivered',
  })
  cfaShopsDelivered: Date;

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
