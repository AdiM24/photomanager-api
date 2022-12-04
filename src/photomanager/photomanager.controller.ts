import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePhotoDto } from './dtos/create-photo.dto';
import { PhotoListItemDto } from './dtos/photo-list-item.dto';
import { PhotomanagerService } from './services/photomanager.service';

@Controller('photo-manager')
export class PhotomanagerController {
  constructor(private readonly photomanagerService: PhotomanagerService) {}

  @Get()
  healthCheck() {
    return this.photomanagerService.healthCheck();
  }

  @Get('list')
  async getPhotos() {
    const res = await this.photomanagerService.getPhotos();

    console.log(res);

    return res;
  }

  @Post()
  @UseInterceptors(FilesInterceptor('image'))
  async upload(@UploadedFiles() photos: Express.Multer.File[]) {
    const response: any[] = [];
    const photoDtos: CreatePhotoDto[] = [];

    photos.forEach((photo) => {
      const photoResponse = {
        originalname: photo.originalname,
        encoding: photo.encoding,
        mimetype: photo.mimetype,
        id: photo.id,
        filename: photo.filename,
        metadata: photo.metadata,
        bucketName: photo.bucketName,
        chunkSize: photo.chunkSize,
        size: photo.size,
        md5: photo.md5,
        uploadDate: photo.uploadDate,
        contentType: photo.contentType,
      };

      response.push(photoResponse);

      photoDtos.push({
        photoId: photo.id,
        createdAt: photo.uploadDate,
        contentType: photo.contentType,
        name: photo.filename.split('.')[0].trim(),
        tags: [],
      });
    });

    await this.photomanagerService.addPhotoDetails(photoDtos);

    return response;
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: any) {
    const file = await this.photomanagerService.getPhotoMetadata(id);
    const filestream = await this.photomanagerService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res);
  }

  @Put('tags')
  async updateTags(@Req() itemToUpdate: any) {
    console.log(itemToUpdate.body);
    return await this.photomanagerService.updateTags(itemToUpdate.body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.photomanagerService.removePhoto(id);
  }
}
