import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Upload } from 'src/base/entities/upload.entity';
import { OrderItem } from 'src/base/entities/order-item.entity';

@Module({
  imports: [SequelizeModule.forFeature([Upload, OrderItem])],
  providers: [UploadsService],
  controllers: [UploadsController],
  exports: [UploadsService],
})
export class UploadsModule {}
