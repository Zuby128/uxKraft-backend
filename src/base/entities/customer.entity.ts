import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from 'sequelize-typescript';
import { OrderItem } from './order-item.entity';

@Table({
  tableName: 'customers',
  timestamps: false,
  underscored: true,
})
export class Customer extends Model<Customer> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'id',
  })
  id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'name',
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'address',
  })
  address: string;

  // Relations
  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}
