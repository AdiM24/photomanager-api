import { Test, TestingModule } from '@nestjs/testing';
import { PhotomanagerController } from './photomanager.controller';

describe('PhotomanagerController', () => {
  let controller: PhotomanagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotomanagerController],
    }).compile();

    controller = module.get<PhotomanagerController>(PhotomanagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
