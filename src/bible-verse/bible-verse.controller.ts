import { Body, Controller, Get, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IntegrationConfig } from './interfaces/integration-config.interface';
import { BibleVerseService } from './bible-verse.service';
import { TelexTickRequest } from './interfaces/telex-tick-request.interface';
import { TelexResponse } from './interfaces/telex-response.interface';
import { firstValueFrom } from 'rxjs';
import { IntegrationConfigService } from './integration-config.service';

@Controller('bible-verse')
export class BibleVerseController {
  constructor(
    private httpService: HttpService,
    private bibleVerseService: BibleVerseService,
    private integrationConfigService: IntegrationConfigService,
  ) {}

  @Get('integration-config')
  async getIntegrationConfig(): Promise<IntegrationConfig> {
    return this.integrationConfigService.getIntegrationConfig();
  }

  @Post('tick')
  async postVerse(@Body() body: TelexTickRequest): Promise<TelexResponse> {
    try {
      // Extract return URL and channel ID from Telex request
      const { return_url, channel_id, settings } = body;

      console.log('body', body);

      if (!return_url && !channel_id) {
        return {
          success: false,
          message: 'No return URL or channel ID provided',
        };
      }

      const verseSettings = {
        Source: settings?.Source || 'Random',
        Translation: settings?.Translation || 'kjv',
        interval: settings?.['interval'] || '* * * * *',
      };

      // Send verse to channel

      const data = await this.bibleVerseService.sendVerseToChannel(
        channel_id,
        verseSettings,
      );

      // Send Telex response to Telex
      await firstValueFrom(this.httpService.post(body.return_url, data));

      return { success: true };
    } catch (error) {
      console.error('Error processing tick:', error);
      return { success: false, message: error.message };
    }
  }
}
