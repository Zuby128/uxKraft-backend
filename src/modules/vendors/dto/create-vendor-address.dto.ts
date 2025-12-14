import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorAddressDto {
  @ApiProperty({
    description: 'Vendor ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  vendorId: number;

  @ApiPropertyOptional({
    description: 'Address title',
    example: 'Main Office',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    description: 'Address',
    example: '123 Business St, New York, NY 10001',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;
}
