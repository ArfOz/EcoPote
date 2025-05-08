import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './logger.service';

@Global()
@Module({
  providers: [
    {
      provide: 'LOGGER_SERVICE_NAME',
      useValue: 'app', // dynamic or default
    },
    {
      provide: WinstonLoggerService,
      useClass: WinstonLoggerService,
    },
  ],
  exports: [WinstonLoggerService],
})
export class WinstonLoggerModule {}
