import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOrderProductionDto } from './create-order-production.dto';

export class UpdateOrderProductionDto extends PartialType(
  OmitType(CreateOrderProductionDto, ['orderItemId'] as const),
) {}
