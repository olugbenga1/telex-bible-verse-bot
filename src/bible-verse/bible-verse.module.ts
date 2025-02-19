import { Module } from '@nestjs/common';
import { BibleVerseService } from './bible-verse.service';
import { BibleVerseController } from './bible-verse.controller';

@Module({
  providers: [BibleVerseService],
  controllers: [BibleVerseController]
})
export class BibleVerseModule {}
