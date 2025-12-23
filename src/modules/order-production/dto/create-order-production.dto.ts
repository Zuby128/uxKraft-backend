import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderProductionDto {
  @ApiProperty({
    description: 'Item ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  itemId: number;

  @ApiPropertyOptional({
    description: 'CFA shops send date',
    example: '2024-01-20',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  cfaShopsSend?: string;

  @ApiPropertyOptional({
    description: 'CFA shops approved date',
    example: '2024-01-22',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  cfaShopsApproved?: string;

  @ApiPropertyOptional({
    description: 'CFA shops delivered date',
    example: '2024-01-30',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  cfaShopsDelivered?: string;
}
