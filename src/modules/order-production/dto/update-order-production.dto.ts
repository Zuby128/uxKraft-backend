import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOrderProductionDto } from './create-order-production.dto';

// itemId güncellenemez, sadece dates güncellenebilir
export class UpdateOrderProductionDto extends PartialType(
  OmitType(CreateOrderProductionDto, ['itemId'] as const),
) {}
