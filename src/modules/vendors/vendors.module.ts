import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Vendor } from 'src/base/entities/vendor.entity';
import { Address } from 'src/base/entities/address.entity';

@Module({
  imports: [SequelizeModule.forFeature([Vendor, Address])],
  providers: [VendorsService],
  controllers: [VendorsController],
  exports: [VendorsService],
})
export class VendorsModule {}
