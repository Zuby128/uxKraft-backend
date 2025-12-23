import {
  IsArray,
  IsInt,
  IsOptional,
  IsDateString,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkUpdateOrderProductionDto {
  @ApiProperty({
    description: 'Array of item IDs to update production for',
    example: [1, 2, 3, 4],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  itemIds: number[];

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
