import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@ApiTags('Vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully' })
  @ApiResponse({ status: 409, description: 'Vendor already exists' })
  createVendor(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.createVendor(createVendorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiQuery({ name: 'includeAddresses', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns all vendors' })
  findAllVendors(@Query('includeAddresses') includeAddresses?: string) {
    const include = includeAddresses === 'true';
    return this.vendorsService.findAllVendors(include);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vendor by ID' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiQuery({ name: 'includeAddresses', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns the vendor' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  findOneVendor(
    @Param('id', ParseIntPipe) id: number,
    @Query('includeAddresses') includeAddresses?: string,
  ) {
    const include = includeAddresses !== 'false'; // Default true
    return this.vendorsService.findOneVendor(id, include);
  }

  @Get(':id/addresses')
  @ApiOperation({ summary: 'Get all addresses for a specific vendor' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns vendor addresses from addresses table',
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  getVendorAddresses(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.getVendorAddresses(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vendor' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({ status: 409, description: 'Vendor name already exists' })
  updateVendor(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorsService.updateVendor(id, updateVendorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a vendor' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ status: 204, description: 'Vendor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  removeVendor(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.removeVendor(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted vendor' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Vendor restored successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({ status: 409, description: 'Vendor is not deleted' })
  restoreVendor(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.restoreVendor(id);
  }
}
