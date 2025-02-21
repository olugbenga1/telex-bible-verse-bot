import { Module } from '@nestjs/common';

import { BibleVerseModule } from './bible-verse/bible-verse.module';

@Module({
  imports: [BibleVerseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
