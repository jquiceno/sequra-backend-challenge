import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DisbursementModel,
  DisbursementSchema,
} from './infrastructure/persistence/schemas';
import { MongoDisbursementRepository } from './infrastructure/persistence/repositories';
import { DisbursementRepository } from './domain/repositories';
import {
  GetAllDisbursementsUseCase,
  GetByMerchantAndDateUseCase,
  ProcessDisbursementUseCase,
} from './application/use-cases';
import { OrdersModule } from '@modules/orders/orders.module';
import { OrderRepository } from '@modules/orders/domain/repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DisbursementModel.name,
        schema: DisbursementSchema,
      },
    ]),
    OrdersModule,
  ],
  providers: [
    {
      provide: DisbursementRepository,
      useClass: MongoDisbursementRepository,
    },
    {
      provide: GetAllDisbursementsUseCase,
      useFactory: (repository: DisbursementRepository) => {
        return new GetAllDisbursementsUseCase(repository);
      },
      inject: [DisbursementRepository],
    },
    {
      provide: GetByMerchantAndDateUseCase,
      useFactory: (repository: DisbursementRepository) => {
        return new GetByMerchantAndDateUseCase(repository);
      },
      inject: [DisbursementRepository],
    },
    {
      provide: ProcessDisbursementUseCase,
      useFactory: (
        repository: DisbursementRepository,
        orderRepository: OrderRepository,
      ) => {
        return new ProcessDisbursementUseCase(orderRepository, repository);
      },
      inject: [DisbursementRepository, OrderRepository],
    },
  ],
  exports: [
    DisbursementRepository,
    GetAllDisbursementsUseCase,
    GetByMerchantAndDateUseCase,
    ProcessDisbursementUseCase,
  ],
})
export class DisbursementModule {}
