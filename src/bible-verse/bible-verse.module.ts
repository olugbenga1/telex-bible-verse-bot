import { Module } from '@nestjs/common';
import { BibleVerseService } from './bible-verse.service';
import { BibleVerseController } from './bible-verse.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [BibleVerseService],
  controllers: [BibleVerseController],
})
export class BibleVerseModule {}
