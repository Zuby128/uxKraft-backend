import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CreateVendorAddressDto } from './dto/create-vendor-address.dto';
import { UpdateVendorAddressDto } from './dto/update-vendor-address.dto';
import { Vendor } from 'src/base/entities/vendor.entity';
import { VendorAddress } from 'src/base/entities/vendor-address.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(VendorAddress)
    private readonly vendorAddressModel: typeof VendorAddress,
  ) {}

  // ==================== Vendor CRUD ====================

  async createVendor(createVendorDto: CreateVendorDto): Promise<Vendor> {
    try {
      const vendor = await this.vendorModel.create(
        createVendorDto as CreationAttributes<Vendor>,
      );
      return vendor;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Vendor with this name already exists');
      }
      throw new InternalServerErrorException('Failed to create vendor');
    }
  }

  async findAllVendors(includeAddresses = false): Promise<Vendor[]> {
    return this.vendorModel.findAll({
      include: includeAddresses ? [VendorAddress] : [],
      order: [['vendorName', 'ASC']],
    });
  }

  async findOneVendor(id: number): Promise<Vendor> {
    const vendor = await this.vendorModel.findByPk(id, {
      include: [VendorAddress],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async updateVendor(
    id: number,
    updateVendorDto: UpdateVendorDto,
  ): Promise<Vendor> {
    const vendor = await this.findOneVendor(id);

    try {
      await vendor.update(updateVendorDto);
      return vendor;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Vendor with this name already exists');
      }
      throw new InternalServerErrorException('Failed to update vendor');
    }
  }

  async removeVendor(id: number): Promise<void> {
    const vendor = await this.findOneVendor(id);
    await vendor.destroy(); // Soft delete
  }

  async restoreVendor(id: number): Promise<Vendor> {
    const vendor = await this.vendorModel.findByPk(id, {
      paranoid: false,
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    if (!vendor.deletedAt) {
      throw new ConflictException('Vendor is not deleted');
    }

    await vendor.restore();
    return this.findOneVendor(id);
  }

  // ==================== VendorAddress CRUD ====================

  async createVendorAddress(
    createVendorAddressDto: CreateVendorAddressDto,
  ): Promise<VendorAddress> {
    // Verify vendor exists
    const vendor = await this.vendorModel.findByPk(
      createVendorAddressDto.vendorId,
    );
    if (!vendor) {
      throw new BadRequestException(
        `Vendor with ID ${createVendorAddressDto.vendorId} not found`,
      );
    }

    try {
      const address = await this.vendorAddressModel.create(
        createVendorAddressDto as CreationAttributes<VendorAddress>,
      );
      return this.findOneVendorAddress(address.id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create vendor address');
    }
  }

  async findAllVendorAddresses(vendorId?: number): Promise<VendorAddress[]> {
    const where = vendorId ? { vendorId } : {};

    return this.vendorAddressModel.findAll({
      where,
      include: [Vendor],
      order: [['title', 'ASC']],
    });
  }

  async findOneVendorAddress(id: number): Promise<VendorAddress> {
    const address = await this.vendorAddressModel.findByPk(id, {
      include: [Vendor],
    });

    if (!address) {
      throw new NotFoundException(`Vendor address with ID ${id} not found`);
    }

    return address;
  }

  async updateVendorAddress(
    id: number,
    updateVendorAddressDto: UpdateVendorAddressDto,
  ): Promise<VendorAddress> {
    const address = await this.findOneVendorAddress(id);

    // Verify vendor exists if vendorId is being updated
    if (updateVendorAddressDto.vendorId) {
      const vendor = await this.vendorModel.findByPk(
        updateVendorAddressDto.vendorId,
      );
      if (!vendor) {
        throw new BadRequestException(
          `Vendor with ID ${updateVendorAddressDto.vendorId} not found`,
        );
      }
    }

    try {
      await address.update(updateVendorAddressDto);
      return this.findOneVendorAddress(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update vendor address');
    }
  }

  async removeVendorAddress(id: number): Promise<void> {
    const address = await this.findOneVendorAddress(id);
    await address.destroy(); // Soft delete
  }

  async restoreVendorAddress(id: number): Promise<VendorAddress> {
    const address = await this.vendorAddressModel.findByPk(id, {
      paranoid: false,
    });

    if (!address) {
      throw new NotFoundException(`Vendor address with ID ${id} not found`);
    }

    if (!address.deletedAt) {
      throw new ConflictException('Vendor address is not deleted');
    }

    await address.restore();
    return this.findOneVendorAddress(id);
  }
}
