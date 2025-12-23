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
import { Item } from './item.entity';

@Table({
  tableName: 'uploads',
  timestamps: true,
  paranoid: true,
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

  @ForeignKey(() => Item)
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
