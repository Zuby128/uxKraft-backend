import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOrderLogisticsDto } from './create-order-logistics.dto';

export class UpdateOrderLogisticsDto extends PartialType(
  OmitType(CreateOrderLogisticsDto, ['orderItemId'] as const),
) {}
