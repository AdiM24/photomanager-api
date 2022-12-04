import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GridMulterConfigService } from '../photomanager/services/grid-multer-config.service';

@Module({
  providers: [GridMulterConfigService],
  imports: [
    MulterModule.registerAsync({
      useClass: GridMulterConfigService,
    }),
  ],
})
export class SharedModule {}
