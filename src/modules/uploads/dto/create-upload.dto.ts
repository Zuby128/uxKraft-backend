import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUploadDto {
  @ApiPropertyOptional({
    description: 'Item ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  itemId?: number;

  @ApiPropertyOptional({
    description: 'File name',
    example: 'product-image.jpg',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'File URL',
    example: 'https://cdn.example.com/uploads/product-image.jpg',
  })
  @IsOptional()
  @IsString()
  url?: string;
}
