import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from 'src/base/entities/item.entity';
import { Upload } from 'src/base/entities/upload.entity';

@Module({
  imports: [SequelizeModule.forFeature([Upload, Item])],
  providers: [UploadsService],
  controllers: [UploadsController],
  exports: [UploadsService],
})
export class UploadsModule {}
