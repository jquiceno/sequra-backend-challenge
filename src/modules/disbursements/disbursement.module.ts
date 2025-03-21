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
import { MerchantsModule } from '@modules/merchants/merchants.module';
import { MerchantRepository } from '@modules/merchants/domain/repositories';
import { GetDateRangesByFrequencyStrategy } from './domain/strategies/get-date-ranges-by-frequency.strategy';
import {
  CalculateDailyDatesRangesService,
  CalculateWeeklyDatesRangesService,
} from './domain/services';
import { ProcessDisbursementCommand } from './infrastructure/commands';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DisbursementModel.name,
        schema: DisbursementSchema,
      },
    ]),
    OrdersModule,
    MerchantsModule,
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
      provide: GetDateRangesByFrequencyStrategy,
      useFactory: (
        dailyService: CalculateDailyDatesRangesService,
        weeklyService: CalculateWeeklyDatesRangesService,
      ) => {
        return new GetDateRangesByFrequencyStrategy(
          dailyService,
          weeklyService,
        );
      },
      inject: [
        CalculateWeeklyDatesRangesService,
        CalculateDailyDatesRangesService,
      ],
    },
    {
      provide: CalculateDailyDatesRangesService,
      useClass: CalculateDailyDatesRangesService,
    },
    {
      provide: CalculateWeeklyDatesRangesService,
      useClass: CalculateWeeklyDatesRangesService,
    },
    {
      provide: ProcessDisbursementUseCase,
      useFactory: (
        repository: DisbursementRepository,
        orderRepository: OrderRepository,
        merchantRepository: MerchantRepository,
        dateRangesStrategy: GetDateRangesByFrequencyStrategy,
      ) => {
        return new ProcessDisbursementUseCase(
          orderRepository,
          repository,
          merchantRepository,
          dateRangesStrategy,
        );
      },
      inject: [
        DisbursementRepository,
        OrderRepository,
        MerchantRepository,
        GetDateRangesByFrequencyStrategy,
      ],
    },
    {
      provide: ProcessDisbursementCommand,
      useFactory: (processDisbursementUseCase: ProcessDisbursementUseCase) => {
        return new ProcessDisbursementCommand(processDisbursementUseCase);
      },
      inject: [ProcessDisbursementUseCase],
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
