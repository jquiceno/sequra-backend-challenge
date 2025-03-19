import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  GetAllMerchantsController,
  GetMerchantByIdController,
  CreateMerchantController,
} from './infrastructure/controllers';
import {
  GetAllMerchantsUseCase,
  GetMerchantByIdUseCase,
  CreateMerchantUseCase,
} from './application/use-cases';
import { MerchantRepository } from './domain/repositories/';
import { MongoMerchantRepository } from './infrastructure/repositories';
import {
  MerchantDocument,
  MerchantSchema,
} from './infrastructure/persistence/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MerchantDocument.name, schema: MerchantSchema },
    ]),
  ],
  controllers: [
    GetAllMerchantsController,
    GetMerchantByIdController,
    CreateMerchantController,
  ],
  providers: [
    {
      provide: MerchantRepository,
      useClass: MongoMerchantRepository,
    },
    {
      provide: GetAllMerchantsUseCase,
      useFactory: (merchantRepository: MerchantRepository) =>
        new GetAllMerchantsUseCase(merchantRepository),
      inject: [MerchantRepository],
    },
    {
      provide: GetMerchantByIdUseCase,
      useFactory: (merchantRepository: MerchantRepository) =>
        new GetMerchantByIdUseCase(merchantRepository),
      inject: [MerchantRepository],
    },
    {
      provide: CreateMerchantUseCase,
      useFactory: (merchantRepository: MerchantRepository) =>
        new CreateMerchantUseCase(merchantRepository),
      inject: [MerchantRepository],
    },
  ],
  exports: [
    GetAllMerchantsUseCase,
    GetMerchantByIdUseCase,
    CreateMerchantUseCase,
  ],
})
export class MerchantsModule {}
