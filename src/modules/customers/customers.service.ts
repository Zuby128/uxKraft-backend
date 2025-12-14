import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from 'src/base/entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer)
    private readonly customerModel: typeof Customer,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = await this.customerModel.create(
        createCustomerDto as CreationAttributes<Customer>,
      );
      return customer;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create customer');
    }
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerModel.findByPk(id);

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    try {
      await customer.update(updateCustomerDto);
      return customer;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update customer');
    }
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await customer.destroy(); // Hard delete (no soft delete for customers)
  }
}
