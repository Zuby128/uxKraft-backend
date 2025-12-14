import { Module } from '@nestjs/common';
import { ItemCategoryController } from './item-category.controller';
import { ItemCategoryService } from './item-category.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemCategory } from 'src/base/entities/item-category.entity';

@Module({
  imports: [SequelizeModule.forFeature([ItemCategory])],
  providers: [ItemCategoryService],
  controllers: [ItemCategoryController],
  exports: [ItemCategoryService],
})
export class ItemCategoryModule {}
