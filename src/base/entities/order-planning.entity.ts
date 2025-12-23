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
  tableName: 'order_planning',
  timestamps: true,
  paranoid: true,
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
