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
  tableName: 'order_planning',
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export class OrderPlanning extends Model<OrderPlanning> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'planning_id',
  })
  planningId: number;

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
    field: 'po_approval_date',
  })
  poApprovalDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'hotel_need_by_date',
  })
  hotelNeedByDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'expected_delivery',
  })
  expectedDelivery: Date;

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
