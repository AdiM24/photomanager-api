import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model, Types } from 'mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucketReadStream } from 'mongodb';
import { PhotoMetadataDto } from '../dtos/photo-meta.dto';
import { CreatePhotoDto } from '../dtos/create-photo.dto';
import { Photo, PhotoDocument } from '../schemas/photo.schema';
import { PhotoListItemDto } from '../dtos/photo-list-item.dto';
import { Console } from 'console';

@Injectable()
export class PhotomanagerService {
  private photoGridFs: MongoGridFS;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
  ) {
    this.photoGridFs = new MongoGridFS(this.connection.db, 'fs');
  }

  healthCheck() {
    return 'Connection has been successfully established!';
  }

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this.photoGridFs.readFileStream(id);
  }

  async getPhotoMetadata(id: string): Promise<PhotoMetadataDto> {
    let result = {} as PhotoMetadataDto;

    try {
      result = await this.photoGridFs.findById(id);
    } catch (err) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      md5: result.md5,
      contentType: result.contentType,
    };
  }

  async getPhotos(): Promise<any> {
    const photos = await this.photoModel.find();

    return photos;
  }

  async removePhoto(id: string): Promise<any> {
    const gridFsBucket = new mongoose.mongo.GridFSBucket(this.connection.db, {
      bucketName: 'fs',
    });
    await this.photoModel.deleteOne({ photoId: id });
    await gridFsBucket.delete(new Types.ObjectId(id));
  }

  async addPhotosDefaultTag(
    photos: CreatePhotoDto[],
  ): Promise<CreatePhotoDto[]> {
    const taggedPhotos = await Promise.all(
      photos.map(async (photo) => {
        photo.tags = [];
        photo.tags?.push(`${photo.contentType.split('/')[1]}`);

        return photo;
      }),
    );

    console.log(taggedPhotos);

    return taggedPhotos;
  }

  async addPhotoDetails(photos: CreatePhotoDto[]): Promise<void> {
    const taggedPhotos = await this.addPhotosDefaultTag(photos);

    this.photoModel
      .insertMany(taggedPhotos)
      .then((res) => {
        console.log(res);
        return 'Images added successfully ';
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async updateTags(photo: PhotoListItemDto) {
    const existingPhoto = await this.photoModel.findById(photo._id);

    if (!existingPhoto) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.NOT_FOUND,
      );
    }

    const systemTag = existingPhoto.tags[0];

    existingPhoto.tags = photo.tags;

    if (!existingPhoto.tags.includes(systemTag)) {
      existingPhoto.tags = [systemTag, ...existingPhoto.tags];
    }

    return await this.photoModel.updateOne({ _id: photo._id }, existingPhoto);
  }
}
