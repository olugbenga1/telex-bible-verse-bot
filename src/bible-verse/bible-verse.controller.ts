import { Controller, Get, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IntegrationConfig } from './interfaces/integration-config.interface';
import { BibleVerseService } from './bible-verse.service';
import { Request } from 'express';

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
            'https://tv43bl8t-3000.use.devtunnels.ms/bible-verse/integration-config',
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
            default: '0 8 * * *',
            options: [
              '0 6 * * *',
              '0 8 * * *',
              '0 10 * * *',
              '0 12 * * *',
              '0 18 * * *',
              '0 21 * * *',
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
}
