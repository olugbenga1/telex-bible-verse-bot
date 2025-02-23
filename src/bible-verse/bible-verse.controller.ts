import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IntegrationConfig } from './interfaces/integration-config.interface';
import { BibleVerseService } from './bible-verse.service';
import { Request } from 'express';
import { TelexTickRequest } from './interfaces/telex-tick-request.interface';
import { TelexResponse } from './interfaces/telex-response.interface';
import { firstValueFrom } from 'rxjs';

@Controller('bible-verse')
export class BibleVerseController {
  constructor(
    private httpService: HttpService,
    private bibleVerseService: BibleVerseService,
  ) {}

  @Get('integration-config')
  getVerse(@Req() request: Request): IntegrationConfig {
    // console.log(IntegrationConfig);
    const baseUrl = request.protocol + '://' + request.get('host');
    return {
      data: {
        date: {
          created_at: 'Feb 21, 2025',
          updated_at: new Date().toISOString().split('T')[0],
        },
        descriptions: {
          app_description: 'Daily Bible verse delivery to your Telex channel',
          app_logo:
            'https://i.postimg.cc/qqpSHdMt/Blue-Waves-Surfing-Club-Logo-3.png',
          app_name: 'Daily Bible Verse',
          app_url:
            'https://telex-bible-verse-bot.onrender.com/bible-verse/integration-config',
          background_color: '#6fd644',
        },
        integration_category: 'Communication & Collaboration',
        integration_type: 'interval',
        is_active: true,
        output: [
          {
            label: 'output_channel_1',
            value: true,
          },
        ],
        key_features: [
          'Daily Bible verses delivered at your chosen time.',
          'Customizable verse sources (books, themes, translations).',
          'Optional reflection prompts with each verse.',
          'Easy configuration via simple commands.',
        ],
        permissions: {
          monitoring_user: {
            always_online: true,
            display_name: 'Bible Verse Bot',
          },
        },
        settings: [
          {
            label: 'Delivery Time',
            type: 'dropdown',
            required: true,
            default: '15 3 * * *',
            options: [
              '0 6 * * *',
              '0 8 * * *',
              '0 10 * * *',
              '0 12 * * *',
              '0 18 * * *',
              '0 21 * * *',
              '5 3 * * *',
              '7 3 * * *',
              '10 10 * * *',
            ],
          },
          {
            label: 'Source',
            type: 'dropdown',
            required: true,
            default: 'Random',
            options: [
              'Random',
              'Psalms',
              'Proverbs',
              'Gospels',
              'Hope',
              'Comfort',
              'Wisdom',
            ],
          },
          {
            label: 'Translation',
            type: 'dropdown',
            required: true,
            default: 'KJV',
            options: ['NIV', 'ESV', 'KJV', 'NLT', 'NASB'],
          },
        ],
        tick_url: `${baseUrl}/bible-verse/tick`,
        target_url: null,
      },
    };
  }

  @Post('tick')
  async postVerse(@Body() body: TelexTickRequest): Promise<TelexResponse> {
    try {
      // Extract return URL and channel ID from Telex request
      const { return_url, channel_id, settings } = body;

      if (!return_url && !channel_id) {
        return {
          success: false,
          message: 'No return URL or channel ID provided',
        };
      }

      const verseSettings = {
        Source: settings?.Source || 'Random',
        Translation: settings?.Translation || 'kjv',
        Delivery_Time: settings?.['Delivery Time'] || '0 8 * * *',
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
