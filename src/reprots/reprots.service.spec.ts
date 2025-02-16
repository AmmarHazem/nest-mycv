import { Test, TestingModule } from '@nestjs/testing';
import { ReprotsService } from './reprots.service';

describe('ReprotsService', () => {
  let service: ReprotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReprotsService],
    }).compile();

    service = module.get<ReprotsService>(ReprotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
