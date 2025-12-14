import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { ItemCategory } from './item-category.entity';

@Table({
  tableName: 'items',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['spec_no'],
      name: 'idx_items_spec_no',
    },
    {
      fields: ['category_id'],
      name: 'idx_items_category',
    },
    {
      fields: ['item_name'],
      name: 'idx_items_name',
    },
  ],
})
export class Item extends Model<Item> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'item_id',
  })
  itemId: number;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'spec_no',
  })
  specNo: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'item_name',
  })
  itemName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'description',
  })
  description: string;

  @ForeignKey(() => ItemCategory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'category_id',
  })
  categoryId: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'each',
    field: 'unit_type',
  })
  unitType: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  notes: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'location',
  })
  location: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'ship_from',
  })
  shipFrom: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'unit_price',
    comment: 'Price in cents (e.g., 10000 = 100.00)',
  })
  unitPrice: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    field: 'markup_percentage',
    comment: 'Markup percentage (e.g., 15.50 = 15.50%)',
  })
  markupPercentage: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'total_price',
    comment: 'Total price in cents (e.g., 11550 = 115.50)',
  })
  totalPrice: number;

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
  @BelongsTo(() => ItemCategory)
  category: ItemCategory;

  // Hooks - Auto calculate total_price
  @BeforeCreate
  @BeforeUpdate
  static calculateTotalPrice(instance: Item) {
    if (
      instance.unitPrice !== undefined &&
      instance.markupPercentage !== undefined
    ) {
      const markupPercentage = parseFloat(instance.markupPercentage.toString());
      const markupAmount = Math.round(
        (instance.unitPrice * markupPercentage) / 100,
      );
      instance.totalPrice = instance.unitPrice + markupAmount;
    }
  }
}
