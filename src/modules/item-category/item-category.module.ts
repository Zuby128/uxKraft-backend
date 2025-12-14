import { Module } from '@nestjs/common';
import { ItemCategoryService } from './item-category.service';
import { ItemCategoryController } from './item-category.controller';

@Module({
  providers: [ItemCategoryService],
  controllers: [ItemCategoryController]
})
export class ItemCategoryModule {}
