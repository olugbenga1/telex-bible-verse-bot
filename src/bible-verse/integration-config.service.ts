import { AppConfigService } from 'src/config/config.service';
import { IntegrationConfig } from './interfaces/integration-config.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationConfigService {
  constructor(private appConfigService: AppConfigService) {}

  // Method for sending Bible verse to channel
  async getIntegrationConfig(): Promise<IntegrationConfig> {
    const baseUrl = this.appConfigService.baseUrl;
    const logoUrl = this.appConfigService.logoUrl;
    return {
      data: {
        date: {
          created_at: 'Feb 21, 2025',
          updated_at: new Date().toISOString().split('T')[0],
        },
        descriptions: {
          app_description: 'Daily Bible verse delivery to your Telex channel',
          app_logo: logoUrl,
          app_name: 'Daily Bible Verse',
          app_url: baseUrl,
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
            label: 'interval',
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
              '* * * * *',
              '5 * * * *',
              '2 * * * *',
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
        target_url: baseUrl,
      },
    };
  }
}
