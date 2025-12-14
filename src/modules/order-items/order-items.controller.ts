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
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { FilterOrderItemDto } from './dto/filter-order-item.dto';

@ApiTags('Order Items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({ status: 201, description: 'Order item created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid foreign key reference' })
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order items' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns all order items' })
  findAll(@Query('includeRelations') includeRelations?: string) {
    const include = includeRelations === 'true';
    return this.orderItemsService.findAll(include);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search and filter order items' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in item name or spec number',
  })
  @ApiQuery({
    name: 'vendorId',
    required: false,
    type: Number,
    description: 'Filter by vendor ID',
  })
  @ApiQuery({
    name: 'itemId',
    required: false,
    type: Number,
    description: 'Filter by item ID',
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    type: Number,
    description: 'Filter by customer ID',
  })
  @ApiQuery({
    name: 'phase',
    required: false,
    type: Number,
    description: 'Filter by phase',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum total price (cents)',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum total price (cents)',
  })
  @ApiResponse({ status: 200, description: 'Returns filtered order items' })
  search(@Query() filterDto: FilterOrderItemDto) {
    return this.orderItemsService.search(filterDto);
  }

  @Get('item/:itemId')
  @ApiOperation({ summary: 'Get order items by item' })
  @ApiParam({ name: 'itemId', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Returns order items for the item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findByItem(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.orderItemsService.findByItem(itemId);
  }

  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Get order items by vendor' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns order items for the vendor',
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  findByVendor(@Param('vendorId', ParseIntPipe) vendorId: number) {
    return this.orderItemsService.findByVendor(vendorId);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get order items by customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns order items for the customer',
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findByCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.orderItemsService.findByCustomer(customerId);
  }

  @Get('phase/:phase')
  @ApiOperation({ summary: 'Get order items by phase' })
  @ApiParam({ name: 'phase', description: 'Phase number' })
  @ApiResponse({
    status: 200,
    description: 'Returns order items in the specified phase',
  })
  findByPhase(@Param('phase', ParseIntPipe) phase: number) {
    return this.orderItemsService.findByPhase(phase);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order item by ID' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiResponse({ status: 200, description: 'Returns the order item' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order item' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiResponse({ status: 200, description: 'Order item updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid foreign key reference' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete an order item' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiResponse({ status: 204, description: 'Order item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted order item' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiResponse({ status: 200, description: 'Order item restored successfully' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiResponse({ status: 409, description: 'Order item is not deleted' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.restore(id);
  }
}
