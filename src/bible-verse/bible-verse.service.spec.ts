import { Test, TestingModule } from '@nestjs/testing';
import { BibleVerseService } from './bible-verse.service';

describe('BibleVerseService', () => {
  let service: BibleVerseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BibleVerseService],
    }).compile();

    service = module.get<BibleVerseService>(BibleVerseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
