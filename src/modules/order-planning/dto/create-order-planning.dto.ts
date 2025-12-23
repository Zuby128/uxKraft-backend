import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderPlanningDto {
  @ApiProperty({
    description: 'Item ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  itemId: number;

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
