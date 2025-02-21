import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BibleVerseService {
  constructor(private httpService: HttpService) {}

  // Method for formatted verse
  async getFormattedVerse(settings): Promise<string> {
    try {
      const verse = await this.fetchBibleVerse(
        settings.Source,
        settings.Translation,
      );
      return this.formatVerseMessage(verse);
    } catch (error) {
      console.error('Error getting formatted verse:');
      throw error;
    }
  }

  // Fetch verse from Bible API based on source and translation
  private async fetchBibleVerse(
    source: string,
    translation: string,
  ): Promise<any> {
    const sourceInfo = this.getPassageFromSource(source);

    // console.log(sourceInfo);

    let apiUrl;
    if (sourceInfo.useRandomEndpoint) {
      if (sourceInfo.bookIds && sourceInfo.bookIds.length > 0) {
        // Use filtered random verses from specific books
        apiUrl = `https://bible-api.com/data/${translation}/random/${sourceInfo.bookIds.join(
          ',',
        )}`;
      } else {
        // Use completely random verse
        apiUrl = `https://bible-api.com/data/${translation}/random`;
      }
    } else {
      // Use specific passage
      apiUrl = `https://bible-api.com/${sourceInfo.passage}?translation=${translation}`;
    }

    try {
      const response = await firstValueFrom(this.httpService.get(apiUrl));

      //   console.log(apiUrl, response.data);

      // Transform the response from random endpoint to match the format from specific passage endpoint
      if (sourceInfo.useRandomEndpoint && response.data.random_verse) {
        const randomVerse = response.data.random_verse;
        // Return in the same format as the specific passage endpoint
        const randomResponse = {
          reference: `${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}`,
          text: randomVerse.text,
          translation: response.data.translation,
          verses: [
            {
              book_id: randomVerse.book_id,
              book_name: randomVerse.book,
              chapter: randomVerse.chapter,
              verse: randomVerse.verse,
              text: randomVerse.text,
            },
          ],
        };
        // console.log('Random response', randomResponse);
        return randomResponse;
      }
      //   console.log('Not Random response', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching Bible verse from apiUrl:', error.message);
      throw error;
    }
  }

  // Format the verse to work well with webhooks
  private formatVerseMessage(verseData: any): string {
    if (!verseData || !verseData.verses || verseData.verses.length === 0) {
      return 'No Bible verse found for the provided settings.';
    }

    const verse = verseData.verses[0];
    let message = `📖 *Daily Bible Verse* 📖\n\n`;
    message += `"${verse.text}"\n\n`;
    message += `*${verseData.reference}*`;

    return message;
  }

  private getPassageFromSource(source: string): {
    passage: string;
    useRandomEndpoint: boolean;
    bookIds?: string[];
  } {
    // For category-based random selection that can use API's filtered random endpoint
    switch (source) {
      case 'Psalms':
        return {
          passage: `Psalm ${Math.floor(Math.random() * 150) + 1}:${
            Math.floor(Math.random() * 20) + 1
          }`,
          useRandomEndpoint: true,
          bookIds: ['PSA'],
        };

      case 'Proverbs':
        return {
          passage: `Proverbs ${Math.floor(Math.random() * 31) + 1}:${
            Math.floor(Math.random() * 30) + 1
          }`,
          useRandomEndpoint: true,
          bookIds: ['PRO'],
        };

      case 'Gospels':
        const gospelIds = ['MAT', 'MRK', 'LUK', 'JHN'];
        const gospels = ['Matthew', 'Mark', 'Luke', 'John'];
        const gospelIndex = Math.floor(Math.random() * gospels.length);
        return {
          passage: `${gospels[gospelIndex]} ${
            Math.floor(Math.random() * 21) + 1
          }:${Math.floor(Math.random() * 30) + 1}`,
          useRandomEndpoint: true,
          bookIds: gospelIds,
        };

      // For specific pre-defined passages, continue using the original approach
      case 'Hope':
        const hopePassages = [
          'Romans 15:13',
          'Hebrews 10:23',
          'Psalm 71:14',
          'Isaiah 40:31',
        ];
        return {
          passage:
            hopePassages[Math.floor(Math.random() * hopePassages.length)],
          useRandomEndpoint: false,
        };

      case 'Comfort':
        const comfortPassages = [
          'Psalm 23:4',
          'Matthew 11:28',
          '2 Corinthians 1:3-4',
          'Isaiah 41:10',
        ];
        return {
          passage:
            comfortPassages[Math.floor(Math.random() * comfortPassages.length)],
          useRandomEndpoint: false,
        };

      case 'Wisdom':
        const wisdomPassages = [
          'Proverbs 2:6',
          'James 1:5',
          'Proverbs 9:10',
          'Colossians 3:16',
        ];
        return {
          passage:
            wisdomPassages[Math.floor(Math.random() * wisdomPassages.length)],
          useRandomEndpoint: false,
        };

      case 'Random':
      default:
        return {
          passage: '',
          useRandomEndpoint: true,
        };
    }
  }
}
