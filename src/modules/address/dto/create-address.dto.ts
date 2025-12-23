import { IsString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({
    description: 'Address title',
    example: 'Main Office',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Full address',
    example: '123 Business Park, New York, NY 10001',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Address type',
    enum: ['vendor', 'customer'],
    example: 'vendor',
  })
  @IsEnum(['vendor', 'customer'])
  type: 'vendor' | 'customer';

  @ApiProperty({
    description: 'Reference ID (vendor_id or customer_id)',
    example: 1,
  })
  @IsInt()
  @Min(1)
  referenceId: number;
}
