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
import { OrderProductionService } from './order-production.service';
import { CreateOrderProductionDto } from './dto/create-order-production.dto';
import { UpdateOrderProductionDto } from './dto/update-order-production.dto';
import { BulkUpdateOrderProductionDto } from './dto/bulk-update-order-production';

@ApiTags('Order Production')
@Controller('order-production')
export class OrderProductionController {
  constructor(
    private readonly orderProductionService: OrderProductionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create order production for an order item' })
  @ApiResponse({
    status: 201,
    description: 'Order production created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid order item ID' })
  @ApiResponse({
    status: 409,
    description: 'Production already exists for this order item',
  })
  create(@Body() createOrderProductionDto: CreateOrderProductionDto) {
    return this.orderProductionService.create(createOrderProductionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order production records' })
  @ApiResponse({
    status: 200,
    description: 'Returns all order production records',
  })
  findAll() {
    return this.orderProductionService.findAll();
  }

  @Get('order-item/:orderItemId')
  @ApiOperation({ summary: 'Get production by order item ID' })
  @ApiParam({ name: 'orderItemId', description: 'Order item ID' })
  @ApiResponse({ status: 200, description: 'Returns the production record' })
  @ApiResponse({
    status: 404,
    description: 'Order item or production not found',
  })
  findByOrderItem(@Param('orderItemId', ParseIntPipe) orderItemId: number) {
    return this.orderProductionService.findByOrderItem(orderItemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order production by ID' })
  @ApiParam({ name: 'id', description: 'Production ID' })
  @ApiResponse({ status: 200, description: 'Returns the production record' })
  @ApiResponse({ status: 404, description: 'Order production not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderProductionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order production' })
  @ApiParam({ name: 'id', description: 'Production ID' })
  @ApiResponse({
    status: 200,
    description: 'Order production updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Order production not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderProductionDto: UpdateOrderProductionDto,
  ) {
    return this.orderProductionService.update(id, updateOrderProductionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete order production' })
  @ApiParam({ name: 'id', description: 'Production ID' })
  @ApiResponse({
    status: 204,
    description: 'Order production deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Order production not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderProductionService.remove(id);
  }

  @Patch('bulk-update')
  @ApiOperation({ summary: 'Bulk update production for multiple order items' })
  @ApiResponse({
    status: 200,
    description: 'Production updated/created successfully',
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
  @ApiResponse({ status: 400, description: 'Invalid order item IDs' })
  @ApiResponse({
    status: 404,
    description: 'No order items found with provided IDs',
  })
  bulkUpdate(@Body() bulkUpdateDto: BulkUpdateOrderProductionDto) {
    const { orderItemIds, ...updateData } = bulkUpdateDto;
    return this.orderProductionService.bulkUpdate(orderItemIds, updateData);
  }
}
