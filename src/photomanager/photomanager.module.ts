import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './schemas/photo.schema';
import { PhotomanagerController } from './photomanager.controller';
import { PhotomanagerService } from './services/photomanager.service';
import { GridMulterConfigService } from './services/grid-multer-config.service';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: GridMulterConfigService,
    }),
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
  ],
  controllers: [PhotomanagerController],
  providers: [PhotomanagerService, GridMulterConfigService],
})
export class PhotomanagerModule {}
