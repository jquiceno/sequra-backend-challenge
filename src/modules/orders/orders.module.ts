import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModel, OrderSchema } from './infrastructure/persistence/schemas';
import { OrderRepository } from './domain/repositories/order.repository';
import { MongoOrderRepository } from './infrastructure/repositories';
import {
  CreateOrderUseCase,
  GetOrdersByMerchantUseCase,
} from './application/use-cases';
import { CreateOrderController } from './infrastructure/controllers/create-order.controller';
import { GetOrdersByMerchantController } from './infrastructure/controllers/get-orders-by-merchant.controller';
import { MerchantsModule } from '@modules/merchants/merchants.module';
import { MerchantRepository } from '@modules/merchants/domain/repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrderModel.name,
        schema: OrderSchema,
      },
    ]),
    MerchantsModule,
  ],
  controllers: [CreateOrderController, GetOrdersByMerchantController],
  providers: [
    {
      provide: OrderRepository,
      useClass: MongoOrderRepository,
    },
    {
      provide: CreateOrderUseCase,
      useFactory: (
        orderRepository: OrderRepository,
        merchantRepository: MerchantRepository,
      ) => new CreateOrderUseCase(orderRepository, merchantRepository),
      inject: [OrderRepository, MerchantRepository],
    },
    {
      provide: GetOrdersByMerchantUseCase,
      useFactory: (orderRepository: OrderRepository) =>
        new GetOrdersByMerchantUseCase(orderRepository),
      inject: [OrderRepository],
    },
  ],
  exports: [OrderRepository, CreateOrderUseCase, GetOrdersByMerchantUseCase],
})
export class OrdersModule {}
