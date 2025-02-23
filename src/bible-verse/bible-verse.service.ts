import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { WebhookPayload } from './interfaces/webhook-payload.interface';
import { FetchVerseSettings } from './interfaces/fetch-verse-settings.interface';
import {
  PassageResponse,
  RandomVerseResponse,
} from './interfaces/api-responses.interface';
import { SourceInfo, VerseData } from './interfaces/verse-data.interface';

@Injectable()
export class BibleVerseService {
  constructor(private httpService: HttpService) {}

  // Method for sending Bible verse to channel
  async sendVerseToChannel(
    channelId: string,
    settings: FetchVerseSettings,
  ): Promise<void> {
    try {
      const verse = await this.getFormattedVerse(settings);
      const webhookUrl = `https://ping.telex.im/v1/webhooks/${channelId}`;

      const payload: WebhookPayload = {
        event_name: 'Daily Bible Verse',
        message: verse,
        status: 'success',
        username: 'Bible Verse Bot',
      };

      await firstValueFrom(this.httpService.post(webhookUrl, payload));
    } catch (error) {
      console.error('Error sending verse to channel:', error.message);
      throw error;
    }
  }

  // Method for formatted verse
  async getFormattedVerse(settings: FetchVerseSettings): Promise<string> {
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
  ): Promise<PassageResponse> {
    const sourceInfo = this.getPassageFromSource(source);

    // console.log(sourceInfo);

    let apiUrl: string;
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
      const response = await firstValueFrom(
        this.httpService.get<RandomVerseResponse | PassageResponse>(apiUrl),
      );

      // Transform the response from random endpoint to match the format from specific passage endpoint
      if (sourceInfo.useRandomEndpoint && 'random_verse' in response.data) {
        const randomData = response.data as RandomVerseResponse;
        const randomVerse = randomData.random_verse;
        // Return in the same format as the specific passage endpoint
        const randomResponse: PassageResponse = {
          reference: `${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}`,
          text: randomVerse.text,
          translation: randomData.translation,
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
        return randomResponse;
      }
      return response.data as PassageResponse;
    } catch (error) {
      console.error('Error fetching Bible verse from apiUrl:', error.message);
      throw error;
    }
  }

  // Format the verse to work well with webhooks
  private formatVerseMessage(verseData: VerseData): string {
    if (!verseData || !verseData.verses || verseData.verses.length === 0) {
      return 'No Bible verse found for the provided settings.';
    }

    const verse = verseData.verses[0];
    let message = `📖 *Daily Bible Verse* 📖\n\n`;
    message += `"${verse.text}"\n\n`;
    message += `*${verseData.reference}*`;

    return message;
  }

  private getPassageFromSource(source: string): SourceInfo {
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
