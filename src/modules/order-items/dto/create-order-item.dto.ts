import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsArray,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiPropertyOptional({
    description: 'Vendor ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  vendorId?: number;

  @ApiPropertyOptional({
    description: 'Vendor address ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  vendorAddress?: number;

  @ApiProperty({
    description: 'Item ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  itemId: number;

  @ApiPropertyOptional({
    description: 'Quantity',
    example: 5,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiProperty({
    description: 'Unit price in cents (e.g., 10000 = $100.00)',
    example: 10000,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({
    description: 'Markup percentage (e.g., 15.50 = 15.50%)',
    example: 15.5,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  markupPercentage?: number;

  @ApiPropertyOptional({
    description: 'Ship to customer ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  shipTo?: number;

  @ApiPropertyOptional({
    description: 'Order phase/status',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  phase?: number;
}
