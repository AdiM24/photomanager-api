import { Test, TestingModule } from '@nestjs/testing';
import { GridMulterConfigService } from '../../photomanager/services/grid-multer-config.service';

describe('GridMulterConfigService', () => {
  let service: GridMulterConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GridMulterConfigService],
    }).compile();

    service = module.get<GridMulterConfigService>(GridMulterConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
