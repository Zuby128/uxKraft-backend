import {
  IsArray,
  IsInt,
  IsOptional,
  IsDateString,
  IsString,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkUpdateOrderLogisticsDto {
  @ApiProperty({
    description: 'Array of item IDs to update logistics for',
    example: [1, 2, 3, 4],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  itemIds: number[];

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
