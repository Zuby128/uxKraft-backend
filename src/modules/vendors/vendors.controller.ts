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
import { CreateVendorAddressDto } from './dto/create-vendor-address.dto';
import { UpdateVendorAddressDto } from './dto/update-vendor-address.dto';

@ApiTags('Vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  // ==================== Vendor Endpoints ====================

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
  @ApiResponse({
    status: 200,
    description: 'Returns the vendor with addresses',
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  findOneVendor(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.findOneVendor(id);
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

  // ==================== VendorAddress Endpoints ====================

  @Post('addresses')
  @ApiOperation({ summary: 'Create a new vendor address' })
  @ApiResponse({
    status: 201,
    description: 'Vendor address created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid vendor ID' })
  createVendorAddress(@Body() createVendorAddressDto: CreateVendorAddressDto) {
    return this.vendorsService.createVendorAddress(createVendorAddressDto);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Get all vendor addresses' })
  @ApiQuery({ name: 'vendorId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns all vendor addresses' })
  findAllVendorAddresses(@Query('vendorId', ParseIntPipe) vendorId?: number) {
    return this.vendorsService.findAllVendorAddresses(vendorId);
  }

  @Get('addresses/:id')
  @ApiOperation({ summary: 'Get a vendor address by ID' })
  @ApiParam({ name: 'id', description: 'Vendor address ID' })
  @ApiResponse({ status: 200, description: 'Returns the vendor address' })
  @ApiResponse({ status: 404, description: 'Vendor address not found' })
  findOneVendorAddress(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.findOneVendorAddress(id);
  }

  @Patch('addresses/:id')
  @ApiOperation({ summary: 'Update a vendor address' })
  @ApiParam({ name: 'id', description: 'Vendor address ID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor address updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid vendor ID' })
  @ApiResponse({ status: 404, description: 'Vendor address not found' })
  updateVendorAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorAddressDto: UpdateVendorAddressDto,
  ) {
    return this.vendorsService.updateVendorAddress(id, updateVendorAddressDto);
  }

  @Delete('addresses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a vendor address' })
  @ApiParam({ name: 'id', description: 'Vendor address ID' })
  @ApiResponse({
    status: 204,
    description: 'Vendor address deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Vendor address not found' })
  removeVendorAddress(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.removeVendorAddress(id);
  }

  @Post('addresses/:id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted vendor address' })
  @ApiParam({ name: 'id', description: 'Vendor address ID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor address restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Vendor address not found' })
  @ApiResponse({ status: 409, description: 'Vendor address is not deleted' })
  restoreVendorAddress(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.restoreVendorAddress(id);
  }
}
