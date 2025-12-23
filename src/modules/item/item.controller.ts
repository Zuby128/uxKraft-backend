import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BulkUpdateItemDto } from './dto/bulk-update-item.dto';
import { ItemsService } from './item.service';
import { FilterItemsDto } from './dto/filter-item.dto';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid category ID' })
  @ApiResponse({
    status: 409,
    description: 'Item with spec number already exists',
  })
  create(@Body() createItemDto: CreateItemDto) {
    console.log('🎯 Controller received DTO:', createItemDto);
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items with pagination' })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include all relations (default: true)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated items',
    schema: {
      example: {
        data: [],
        meta: {
          total: 100,
          page: 1,
          limit: 10,
          totalPages: 10,
        },
      },
    },
  })
  findAll(
    @Query('includeRelations') includeRelations?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const includeR = includeRelations !== 'false';
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.itemsService.findAll(includeR, pageNum, limitNum);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search and filter items with advanced options' })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered and paginated items',
    schema: {
      example: {
        data: [
          {
            itemId: 1,
            itemName: 'Premium Leather Sofa',
            specNo: 'SOFA-001',
            vendorId: 1,
            phase: 3,
            category: { categoryId: 1, name: 'Furniture' },
            vendor: { vendorId: 1, vendorName: 'ACME Corporation' },
            customer: { id: 1, name: 'Hotel California' },
            orderPlanning: { planningId: 1 },
            orderProduction: { productionId: 1 },
            orderLogistics: { logisticsId: 1 },
          },
        ],
        meta: {
          total: 50,
          page: 1,
          limit: 10,
          totalPages: 5,
        },
      },
    },
  })
  search(@Query() filters: FilterItemsDto) {
    return this.itemsService.search(filters);
  }

  @Get('spec/:specNo')
  @ApiOperation({ summary: 'Get an item by spec number' })
  @ApiParam({ name: 'specNo', description: 'Item specification number' })
  @ApiResponse({ status: 200, description: 'Returns the item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findBySpecNo(@Param('specNo') specNo: string) {
    return this.itemsService.findBySpecNo(specNo);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get items by category' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Returns items in the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.itemsService.findByCategory(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Returns the item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }

  @Patch('bulk-update')
  @ApiOperation({ summary: 'Bulk update multiple items' })
  @ApiResponse({
    status: 200,
    description: 'Items updated successfully',
    schema: {
      type: 'object',
      properties: {
        updatedCount: { type: 'number', example: 5 },
        updatedItems: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid item IDs or category ID' })
  @ApiResponse({ status: 404, description: 'No items found with provided IDs' })
  bulkUpdate(@Body() bulkUpdateItemDto: BulkUpdateItemDto) {
    const { itemIds, ...updateData } = bulkUpdateItemDto;
    return this.itemsService.bulkUpdate(itemIds, updateData as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an item' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid category ID' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({
    status: 409,
    description: 'Item with spec number already exists',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete an item' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: 204, description: 'Item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted item' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Item restored successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 409, description: 'Item is not deleted' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.restore(id);
  }
}
