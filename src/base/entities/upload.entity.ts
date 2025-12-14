import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { OrderItem } from './order-item.entity';

@Table({
  tableName: 'uploads',
  timestamps: false,
  underscored: true,
})
export class Upload extends Model<Upload> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'id',
  })
  id: number;

  @ForeignKey(() => OrderItem)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'item_id',
  })
  itemId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'name',
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'url',
  })
  url: string;

  // Relations
  @BelongsTo(() => OrderItem)
  orderItem: OrderItem;
}
