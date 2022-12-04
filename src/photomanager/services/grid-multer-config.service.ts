import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage';

@Injectable()
export class GridMulterConfigService implements MulterOptionsFactory {
  gridFsStorage: any;

  constructor() {
    this.gridFsStorage = new GridFsStorage({
      url: 'mongodb://localhost/photomanager',
      file: (req: any, file: any) => {
        return new Promise((resolve, reject) => {
          console.log('fmm');
          const filename = file.originalname.trim();
          const fileInfo = {
            filename: filename,
          };
          resolve(fileInfo);
        });
      },
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.gridFsStorage,
    };
  }
}
