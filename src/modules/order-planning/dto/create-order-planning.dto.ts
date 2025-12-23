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
    description: 'Sample approved date',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  sampleApprovedDate?: string;

  @ApiPropertyOptional({
    description: 'PI send date',
    example: '2024-01-20',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  piSendDate?: string;

  @ApiPropertyOptional({
    description: 'PI approved date',
    example: '2024-01-25',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  piApprovedDate?: string;

  @ApiPropertyOptional({
    description: 'Initial payment date',
    example: '2024-02-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  initialPaymentDate?: string;
}
