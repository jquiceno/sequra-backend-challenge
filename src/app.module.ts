import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { ResponseInterceptor } from './infrastructure/interceptors';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OrdersModule } from '@modules/orders/orders.module';
import { DisbursementModule } from '@modules/disbursements/disbursement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/sequra_db', {
      autoCreate: true,
    }),
    MerchantsModule,
    OrdersModule,
    DisbursementModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
