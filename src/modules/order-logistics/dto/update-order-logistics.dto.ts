import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOrderLogisticsDto } from './create-order-logistics.dto';

// itemId güncellenemez, sadece dates ve notes güncellenebilir
export class UpdateOrderLogisticsDto extends PartialType(
  OmitType(CreateOrderLogisticsDto, ['itemId'] as const),
) {}
