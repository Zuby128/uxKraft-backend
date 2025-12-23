import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from 'src/base/entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address)
    private readonly addressModel: typeof Address,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    return this.addressModel.create(createAddressDto as any);
  }

  async findAll(): Promise<Address[]> {
    return this.addressModel.findAll({
      order: [['addressId', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressModel.findByPk(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async findByReference(
    type: 'vendor' | 'customer',
    referenceId: number,
  ): Promise<Address[]> {
    return this.addressModel.findAll({
      where: { type, referenceId },
      order: [['addressId', 'ASC']],
    });
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOne(id);
    await address.update(updateAddressDto);
    return address;
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    await address.destroy();
  }
}
