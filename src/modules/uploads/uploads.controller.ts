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
import { UploadsService } from './uploads.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new upload' })
  @ApiResponse({ status: 201, description: 'Upload created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order item ID' })
  create(@Body() createUploadDto: CreateUploadDto) {
    return this.uploadsService.create(createUploadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all uploads' })
  @ApiQuery({ name: 'itemId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns all uploads' })
  findAll(@Query('itemId', ParseIntPipe) itemId?: number) {
    return this.uploadsService.findAll(itemId);
  }

  @Get('item/:itemId')
  @ApiOperation({ summary: 'Get uploads by item' })
  @ApiParam({ name: 'itemId', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Returns uploads for the item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findByItem(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.uploadsService.findByItem(itemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an upload by ID' })
  @ApiParam({ name: 'id', description: 'Upload ID' })
  @ApiResponse({ status: 200, description: 'Returns the upload' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.uploadsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an upload' })
  @ApiParam({ name: 'id', description: 'Upload ID' })
  @ApiResponse({ status: 200, description: 'Upload updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order item ID' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUploadDto: UpdateUploadDto,
  ) {
    return this.uploadsService.update(id, updateUploadDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an upload' })
  @ApiParam({ name: 'id', description: 'Upload ID' })
  @ApiResponse({ status: 204, description: 'Upload deleted successfully' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.uploadsService.remove(id);
  }
}
