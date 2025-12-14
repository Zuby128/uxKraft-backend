import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDateString,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderLogisticsDto {
  @ApiProperty({
    description: 'Order item ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  orderItemId: number;

  @ApiPropertyOptional({
    description: 'Ordered date',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  orderedDate?: string;

  @ApiPropertyOptional({
    description: 'Shipped date',
    example: '2024-01-18',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  shippedDate?: string;

  @ApiPropertyOptional({
    description: 'Delivered date',
    example: '2024-01-22',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  deliveredDate?: string;

  @ApiPropertyOptional({
    description: 'Shipping notes',
    example: 'Express delivery, signature required',
  })
  @IsOptional()
  @IsString()
  shippingNotes?: string;
}
