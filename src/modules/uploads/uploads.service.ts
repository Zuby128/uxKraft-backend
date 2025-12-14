import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { Upload } from 'src/base/entities/upload.entity';
import { Item } from 'src/base/entities/item.entity';

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Upload)
    private readonly uploadModel: typeof Upload,
    @InjectModel(Item)
    private readonly itemModel: typeof Item,
  ) {}

  async create(createUploadDto: CreateUploadDto): Promise<Upload> {
    // Verify item exists if itemId is provided
    if (createUploadDto.itemId) {
      const item = await this.itemModel.findByPk(createUploadDto.itemId);
      if (!item) {
        throw new BadRequestException(
          `Item with ID ${createUploadDto.itemId} not found`,
        );
      }
    }

    try {
      const upload = await this.uploadModel.create(
        createUploadDto as CreationAttributes<Upload>,
      );
      return this.findOne(upload.id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create upload');
    }
  }

  async findAll(itemId?: number): Promise<Upload[]> {
    const where = itemId ? { itemId } : {};

    return this.uploadModel.findAll({
      where,
      include: [Item],
      order: [['id', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Upload> {
    const upload = await this.uploadModel.findByPk(id, {
      include: [Item],
    });

    if (!upload) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }

    return upload;
  }

  async findByItem(itemId: number): Promise<Upload[]> {
    const item = await this.itemModel.findByPk(itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    return this.uploadModel.findAll({
      where: { itemId },
      include: [Item],
      order: [['id', 'DESC']],
    });
  }

  async update(id: number, updateUploadDto: UpdateUploadDto): Promise<Upload> {
    const upload = await this.findOne(id);

    // Verify item exists if itemId is being updated
    if (updateUploadDto.itemId) {
      const item = await this.itemModel.findByPk(updateUploadDto.itemId);
      if (!item) {
        throw new BadRequestException(
          `Item with ID ${updateUploadDto.itemId} not found`,
        );
      }
    }

    try {
      await upload.update(updateUploadDto);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update upload');
    }
  }

  async remove(id: number): Promise<void> {
    const upload = await this.findOne(id);
    await upload.destroy(); // Hard delete (no soft delete for uploads)
  }
}
