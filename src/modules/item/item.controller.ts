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
import { ItemService } from './item.service';

@ApiTags('Items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemsService: ItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid category ID' })
  @ApiResponse({
    status: 409,
    description: 'Item with spec number already exists',
  })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiQuery({ name: 'includeCategory', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns all items' })
  findAll(@Query('includeCategory') includeCategory?: string) {
    const include = includeCategory === 'true';
    return this.itemsService.findAll(include);
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
