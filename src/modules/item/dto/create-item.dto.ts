import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  MaxLength,
  Min,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({
    description: 'Specification number (unique)',
    example: 'SPEC-001',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  specNo: string;

  @ApiProperty({
    description: 'Item name',
    example: 'Premium Sofa',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  itemName: string;

  @ApiPropertyOptional({
    description: 'Item description',
    example: 'High-quality leather sofa with oak frame',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  categoryId: number;

  @ApiPropertyOptional({
    description: 'Unit type',
    example: 'each',
    default: 'each',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unitType?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Handle with care',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Storage location',
    example: 'Warehouse A, Section 3',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Ship from location',
    example: 'New York Distribution Center',
  })
  @IsOptional()
  @IsString()
  shipFrom?: string;

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
}
