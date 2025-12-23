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
  tableName: 'order_production',
  timestamps: true,
  paranoid: true,
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
