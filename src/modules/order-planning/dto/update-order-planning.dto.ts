import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOrderPlanningDto } from './create-order-planning.dto';

export class UpdateOrderPlanningDto extends PartialType(
  OmitType(CreateOrderPlanningDto, ['itemId'] as const),
) {}
