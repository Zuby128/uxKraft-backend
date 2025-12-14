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
import { OrderPlanningService } from './order-planning.service';
import { CreateOrderPlanningDto } from './dto/create-order-planning.dto';
import { UpdateOrderPlanningDto } from './dto/update-order-planning.dto';

@ApiTags('Order Planning')
@Controller('order-planning')
export class OrderPlanningController {
  constructor(private readonly orderPlanningService: OrderPlanningService) {}

  @Post()
  @ApiOperation({ summary: 'Create order planning for an order item' })
  @ApiResponse({
    status: 201,
    description: 'Order planning created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid order item ID' })
  @ApiResponse({
    status: 409,
    description: 'Planning already exists for this order item',
  })
  create(@Body() createOrderPlanningDto: CreateOrderPlanningDto) {
    return this.orderPlanningService.create(createOrderPlanningDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order planning records' })
  @ApiResponse({
    status: 200,
    description: 'Returns all order planning records',
  })
  findAll() {
    return this.orderPlanningService.findAll();
  }

  @Get('order-item/:orderItemId')
  @ApiOperation({ summary: 'Get planning by order item ID' })
  @ApiParam({ name: 'orderItemId', description: 'Order item ID' })
  @ApiResponse({ status: 200, description: 'Returns the planning record' })
  @ApiResponse({ status: 404, description: 'Order item or planning not found' })
  findByOrderItem(@Param('orderItemId', ParseIntPipe) orderItemId: number) {
    return this.orderPlanningService.findByOrderItem(orderItemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order planning by ID' })
  @ApiParam({ name: 'id', description: 'Planning ID' })
  @ApiResponse({ status: 200, description: 'Returns the planning record' })
  @ApiResponse({ status: 404, description: 'Order planning not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderPlanningService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order planning' })
  @ApiParam({ name: 'id', description: 'Planning ID' })
  @ApiResponse({
    status: 200,
    description: 'Order planning updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Order planning not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderPlanningDto: UpdateOrderPlanningDto,
  ) {
    return this.orderPlanningService.update(id, updateOrderPlanningDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete order planning' })
  @ApiParam({ name: 'id', description: 'Planning ID' })
  @ApiResponse({
    status: 204,
    description: 'Order planning deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Order planning not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderPlanningService.remove(id);
  }
}
