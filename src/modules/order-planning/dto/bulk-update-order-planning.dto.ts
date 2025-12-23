import {
  IsArray,
  IsInt,
  IsOptional,
  IsDateString,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkUpdateOrderPlanningDto {
  @ApiProperty({
    description: 'Array of order item IDs to update planning for',
    example: [1, 2, 3, 4],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  itemIds: number[];

  @ApiPropertyOptional({
    description: 'PO approval date',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  poApprovalDate?: string;

  @ApiPropertyOptional({
    description: 'Hotel need by date',
    example: '2024-02-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  hotelNeedByDate?: string;

  @ApiPropertyOptional({
    description: 'Expected delivery date',
    example: '2024-01-25',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  expectedDelivery?: string;
}
