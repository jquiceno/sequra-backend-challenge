import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DisbursementModule } from './modules/disbursements';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DisbursementModule,
  ],
})
export class AppModule {}
