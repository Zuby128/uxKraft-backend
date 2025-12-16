import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkUpdateItemDto {
  @ApiProperty({
    description: 'Array of item IDs to update',
    example: [1, 2, 3, 4],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  itemIds: number[];

  @ApiPropertyOptional({
    description: 'Category ID to set for all items',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number | null;

  @ApiPropertyOptional({
    description: 'Location to set for all items',
    example: 'Warehouse A, Section 3',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Ship from location to set for all items',
    example: 'New York Distribution Center',
  })
  @IsOptional()
  @IsString()
  shipFrom?: string;

  @ApiPropertyOptional({
    description: 'Notes to set for all items',
    example: 'Updated in bulk - Q4 2024',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
