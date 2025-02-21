import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { BibleVerseService } from './bible-verse.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  PassageResponse,
  RandomVerseResponse,
} from './interfaces/api-responses.interface';

describe('BibleVerseService', () => {
  let service: BibleVerseService;
  let httpService: HttpService;

  beforeEach(async () => {
    const httpServiceMock = {
      post: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BibleVerseService,
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
      ],
    }).compile();

    service = module.get<BibleVerseService>(BibleVerseService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerseToChannel', () => {
    it('should successfully send verse to channel', async () => {
      // Mock getFormattedVerse to return a sample verse
      jest
        .spyOn(service as any, 'getFormattedVerse')
        .mockResolvedValue('Test verse message');

      // Mock http post to return success
      jest.spyOn(httpService, 'post').mockImplementation(() => {
        return of({ data: { success: true }, status: 200 } as AxiosResponse);
      });

      await expect(
        service.sendVerseToChannel('channel123', {
          Source: 'Random',
          Translation: 'kjv',
        }),
      ).resolves.not.toThrow();

      expect(httpService.post).toHaveBeenCalledWith(
        'https://ping.telex.im/v1/webhooks/channel123',
        {
          event_name: 'Daily Bible Verse',
          message: 'Test verse message',
          status: 'success',
          username: 'Bible Verse Bot',
        },
      );
    });

    it('should throw error when http request fails', async () => {
      // Mock getFormattedVerse to return a sample verse
      jest
        .spyOn(service as any, 'getFormattedVerse')
        .mockResolvedValue('Test verse message');

      // Mock http post to throw error
      jest.spyOn(httpService, 'post').mockImplementation(() => {
        return throwError(() => new Error('Network error'));
      });

      await expect(
        service.sendVerseToChannel('channel123', {
          Source: 'Random',
          Translation: 'kjv',
        }),
      ).rejects.toThrow('Network error');
    });
  });

  describe('getFormattedVerse', () => {
    it('should return formatted verse', async () => {
      const mockPassageResponse: PassageResponse = {
        reference: 'John 3:16',
        translation: 'kjv',
        text: 'For God so loved the world...',
        verses: [
          {
            book_id: 'JHN',
            book_name: 'John',
            chapter: 3,
            verse: 16,
            text: 'For God so loved the world...',
          },
        ],
      };

      // Mock fetchBibleVerse method
      jest
        .spyOn(service as any, 'fetchBibleVerse')
        .mockResolvedValue(mockPassageResponse);

      const result = await service.getFormattedVerse({
        Source: 'Random',
        Translation: 'kjv',
      });

      expect(result).toContain('📖 *Daily Bible Verse* 📖');
      expect(result).toContain('For God so loved the world...');
      expect(result).toContain('*John 3:16*');
    });

    it('should throw error when fetchBibleVerse fails', async () => {
      // Mock fetchBibleVerse to throw error
      jest.spyOn(service as any, 'fetchBibleVerse').mockImplementation(() => {
        throw new Error('API error');
      });

      await expect(
        service.getFormattedVerse({
          Source: 'Random',
          Translation: 'kjv',
        }),
      ).rejects.toThrow('API error');
    });
  });

  describe('fetchBibleVerse', () => {
    it('should fetch random verse', async () => {
      const mockRandomResponse: RandomVerseResponse = {
        translation: 'kjv',
        random_verse: {
          book_id: 'GEN',
          book: 'Genesis',
          chapter: 1,
          verse: 1,
          text: 'In the beginning God created the heaven and the earth.',
        },
      };

      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return of({ data: mockRandomResponse, status: 200 } as AxiosResponse);
      });

      const result = await (service as any).fetchBibleVerse('Random', 'kjv');

      expect(result.reference).toBe('Genesis 1:1');
      expect(result.verses[0].text).toBe(
        'In the beginning God created the heaven and the earth.',
      );
      expect(httpService.get).toHaveBeenCalledWith(
        'https://bible-api.com/data/kjv/random',
      );
    });

    it('should fetch verse from Psalms', async () => {
      const mockRandomResponse: RandomVerseResponse = {
        translation: 'kjv',
        random_verse: {
          book_id: 'PSA',
          book: 'Psalms',
          chapter: 23,
          verse: 1,
          text: 'The LORD is my shepherd; I shall not want.',
        },
      };

      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return of({ data: mockRandomResponse, status: 200 } as AxiosResponse);
      });

      const result = await (service as any).fetchBibleVerse('Psalms', 'kjv');

      expect(result.reference).toBe('Psalms 23:1');
      expect(result.verses[0].text).toBe(
        'The LORD is my shepherd; I shall not want.',
      );
      expect(httpService.get).toHaveBeenCalledWith(
        'https://bible-api.com/data/kjv/random/PSA',
      );
    });

    it('should fetch specific passage for themed categories', async () => {
      const mockPassageResponse: PassageResponse = {
        reference: 'Romans 15:13',
        translation: 'kjv',
        text: 'Now the God of hope fill you with all joy and peace in believing...',
        verses: [
          {
            book_id: 'ROM',
            book_name: 'Romans',
            chapter: 15,
            verse: 13,
            text: 'Now the God of hope fill you with all joy and peace in believing...',
          },
        ],
      };

      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return of({ data: mockPassageResponse, status: 200 } as AxiosResponse);
      });

      const result = await (service as any).fetchBibleVerse('Hope', 'kjv');

      expect(result.reference).toBe('Romans 15:13');
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringMatching(
          /^https:\/\/bible-api\.com\/(Romans 15:13|Hebrews 10:23|Psalm 71:14|Isaiah 40:31)/,
        ),
      );
    });

    it('should handle API errors gracefully', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return throwError(() => new Error('API unavailable'));
      });

      await expect(
        (service as any).fetchBibleVerse('Random', 'kjv'),
      ).rejects.toThrow('API unavailable');
    });
  });

  describe('formatVerseMessage', () => {
    it('should format verse data correctly', () => {
      const verseData = {
        reference: 'John 3:16',
        translation: 'kjv',
        text: 'For God so loved the world...',
        verses: [
          {
            book_id: 'JHN',
            book_name: 'John',
            chapter: 3,
            verse: 16,
            text: 'For God so loved the world...',
          },
        ],
      };

      const result = (service as any).formatVerseMessage(verseData);

      expect(result).toEqual(
        '📖 *Daily Bible Verse* 📖\n\n"For God so loved the world..."\n\n*John 3:16*',
      );
    });

    it('should handle empty verse data', () => {
      const result = (service as any).formatVerseMessage({
        verses: [],
      });

      expect(result).toEqual('No Bible verse found for the provided settings.');
    });

    it('should handle null verse data', () => {
      const result = (service as any).formatVerseMessage(null);

      expect(result).toEqual('No Bible verse found for the provided settings.');
    });
  });

  describe('getPassageFromSource', () => {
    it('should return random endpoint for Random source', () => {
      const result = (service as any).getPassageFromSource('Random');

      expect(result.passage).toBe('');
      expect(result.useRandomEndpoint).toBe(true);
    });

    it('should return Psalms configuration', () => {
      const result = (service as any).getPassageFromSource('Psalms');

      expect(result.useRandomEndpoint).toBe(true);
      expect(result.bookIds).toEqual(['PSA']);
      expect(result.passage).toMatch(/^Psalm \d+:\d+$/);
    });

    it('should return Proverbs configuration', () => {
      const result = (service as any).getPassageFromSource('Proverbs');

      expect(result.useRandomEndpoint).toBe(true);
      expect(result.bookIds).toEqual(['PRO']);
      expect(result.passage).toMatch(/^Proverbs \d+:\d+$/);
    });

    it('should return Gospels configuration', () => {
      const result = (service as any).getPassageFromSource('Gospels');

      expect(result.useRandomEndpoint).toBe(true);
      expect(result.bookIds).toEqual(['MAT', 'MRK', 'LUK', 'JHN']);
      expect(result.passage).toMatch(/^(Matthew|Mark|Luke|John) \d+:\d+$/);
    });

    it('should return Hope configuration', () => {
      const result = (service as any).getPassageFromSource('Hope');

      expect(result.useRandomEndpoint).toBe(false);
      expect([
        'Romans 15:13',
        'Hebrews 10:23',
        'Psalm 71:14',
        'Isaiah 40:31',
      ]).toContain(result.passage);
    });

    it('should return Comfort configuration', () => {
      const result = (service as any).getPassageFromSource('Comfort');

      expect(result.useRandomEndpoint).toBe(false);
      expect([
        'Psalm 23:4',
        'Matthew 11:28',
        '2 Corinthians 1:3-4',
        'Isaiah 41:10',
      ]).toContain(result.passage);
    });

    it('should return Wisdom configuration', () => {
      const result = (service as any).getPassageFromSource('Wisdom');

      expect(result.useRandomEndpoint).toBe(false);
      expect([
        'Proverbs 2:6',
        'James 1:5',
        'Proverbs 9:10',
        'Colossians 3:16',
      ]).toContain(result.passage);
    });

    it('should return Random configuration for unknown source', () => {
      const result = (service as any).getPassageFromSource('UnknownSource');

      expect(result.passage).toBe('');
      expect(result.useRandomEndpoint).toBe(true);
    });
  });
});
