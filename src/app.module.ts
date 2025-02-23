import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { BibleVerseModule } from './bible-verse/bible-verse.module';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { AppConfigModule } from 'src/config/config.module';

@Module({
  imports: [BibleVerseModule, AppConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
