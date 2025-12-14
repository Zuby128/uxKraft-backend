import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiPropertyOptional({
    description: 'Customer name',
    example: 'Hotel California',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    description: 'Customer address',
    example: '1 Beach Rd, Los Angeles, CA 90001',
  })
  @IsOptional()
  @IsString()
  address?: string;
}
