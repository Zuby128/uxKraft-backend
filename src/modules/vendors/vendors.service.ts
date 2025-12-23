import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from 'src/base/entities/vendor.entity';
import { Address } from 'src/base/entities/address.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(Address)
    private readonly addressModel: typeof Address,
  ) {}

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
    const vendors = await this.vendorModel.findAll({
      order: [['vendorName', 'ASC']],
    });

    if (includeAddresses) {
      // Load addresses separately and attach
      for (const vendor of vendors) {
        const addresses = await this.addressModel.findAll({
          where: { type: 'vendor', referenceId: vendor.vendorId },
        });
        (vendor as any).addresses = addresses;
      }
    }

    return vendors;
  }

  async findOneVendor(id: number, includeAddresses = true): Promise<Vendor> {
    const vendor = await this.vendorModel.findByPk(id);

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    if (includeAddresses) {
      const addresses = await this.addressModel.findAll({
        where: { type: 'vendor', referenceId: vendor.vendorId },
      });
      (vendor as any).addresses = addresses;
    }

    return vendor;
  }

  async updateVendor(
    id: number,
    updateVendorDto: UpdateVendorDto,
  ): Promise<Vendor> {
    const vendor = await this.findOneVendor(id, false);

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
    const vendor = await this.findOneVendor(id, false);
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

  // ==================== Vendor Addresses ====================
  // Note: Address CRUD is now handled by AddressesService
  // These methods are for convenience when working with vendors

  async getVendorAddresses(vendorId: number): Promise<Address[]> {
    // Verify vendor exists
    await this.findOneVendor(vendorId, false);

    return this.addressModel.findAll({
      where: { type: 'vendor', referenceId: vendorId },
      order: [['addressId', 'ASC']],
    });
  }
}
