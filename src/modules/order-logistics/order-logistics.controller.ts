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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderLogisticsService } from './order-logistics.service';
import { CreateOrderLogisticsDto } from './dto/create-order-logistics.dto';
import { UpdateOrderLogisticsDto } from './dto/update-order-logistics.dto';
import { BulkUpdateOrderLogisticsDto } from './dto/bulk-update-order-logistics.dto';

@ApiTags('Order Logistics')
@Controller('order-logistics')
export class OrderLogisticsController {
  constructor(private readonly orderLogisticsService: OrderLogisticsService) {}

  @Post()
  @ApiOperation({ summary: 'Create order logistics for an order item' })
  @ApiResponse({
    status: 201,
    description: 'Order logistics created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid order item ID' })
  @ApiResponse({
    status: 409,
    description: 'Logistics already exists for this order item',
  })
  create(@Body() createOrderLogisticsDto: CreateOrderLogisticsDto) {
    return this.orderLogisticsService.create(createOrderLogisticsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order logistics records' })
  @ApiResponse({
    status: 200,
    description: 'Returns all order logistics records',
  })
  findAll() {
    return this.orderLogisticsService.findAll();
  }

  @Get('item/:itemId')
  @ApiOperation({ summary: 'Get logistics by item ID' })
  @ApiParam({ name: 'itemId', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Returns the logistics record' })
  @ApiResponse({ status: 404, description: 'Item or logistics not found' })
  findByItem(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.orderLogisticsService.findByItem(itemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order logistics by ID' })
  @ApiParam({ name: 'id', description: 'Logistics ID' })
  @ApiResponse({ status: 200, description: 'Returns the logistics record' })
  @ApiResponse({ status: 404, description: 'Order logistics not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderLogisticsService.findOne(id);
  }

  @Patch('bulk-update')
  @ApiOperation({ summary: 'Bulk update logistics for multiple order items' })
  @ApiResponse({
    status: 200,
    description: 'Logistics updated/created successfully',
    schema: {
      type: 'object',
      properties: {
        totalCount: { type: 'number', example: 5 },
        results: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid item IDs' })
  @ApiResponse({ status: 404, description: 'No items found with provided IDs' })
  bulkUpdate(@Body() bulkUpdateDto: BulkUpdateOrderLogisticsDto) {
    const { itemIds, ...updateData } = bulkUpdateDto;
    return this.orderLogisticsService.bulkUpdate(itemIds, updateData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order logistics' })
  @ApiParam({ name: 'id', description: 'Logistics ID' })
  @ApiResponse({
    status: 200,
    description: 'Order logistics updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Order logistics not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderLogisticsDto: UpdateOrderLogisticsDto,
  ) {
    return this.orderLogisticsService.update(id, updateOrderLogisticsDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete order logistics' })
  @ApiParam({ name: 'id', description: 'Logistics ID' })
  @ApiResponse({
    status: 204,
    description: 'Order logistics deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Order logistics not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderLogisticsService.remove(id);
  }
}
