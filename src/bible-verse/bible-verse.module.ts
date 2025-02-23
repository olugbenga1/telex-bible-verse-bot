import { Module } from '@nestjs/common';
import { BibleVerseController } from './bible-verse.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { IntegrationConfigService } from './integration-config.service';
import { BibleVerseService } from './bible-verse.service';
import { AppConfigService } from 'src/config/config.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [BibleVerseService, IntegrationConfigService, AppConfigService],
  controllers: [BibleVerseController],
})
export class BibleVerseModule {}
