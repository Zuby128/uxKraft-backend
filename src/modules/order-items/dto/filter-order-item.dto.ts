import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterOrderItemDto {
  @ApiPropertyOptional({
    description: 'Search in item name and spec number',
    example: 'sofa',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Vendor ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vendorId?: number;

  @ApiPropertyOptional({
    description: 'Item ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  itemId?: number;

  @ApiPropertyOptional({
    description: 'Customer ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  customerId?: number;

  @ApiPropertyOptional({
    description: 'Phase/Status',
    example: 3,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  phase?: number;

  @ApiPropertyOptional({
    description: 'Minimum total price (in cents)',
    example: 10000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum total price (in cents)',
    example: 50000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;
}
