import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BibleVerseModule } from './bible-verse/bible-verse.module';

@Module({
  imports: [BibleVerseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
