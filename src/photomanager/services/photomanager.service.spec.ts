import { Test, TestingModule } from '@nestjs/testing';
import { PhotomanagerService } from './photomanager.service';

describe('PhotomanagerService', () => {
  let service: PhotomanagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotomanagerService],
    }).compile();

    service = module.get<PhotomanagerService>(PhotomanagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
