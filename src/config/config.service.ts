import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get baseUrl(): string {
    return this.configService.get<string>('baseUrl');
  }

  get logoUrl(): string {
    return this.configService.get<string>('logoUrl');
  }
}
