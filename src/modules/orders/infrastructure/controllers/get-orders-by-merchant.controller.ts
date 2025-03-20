import { Controller, Get, Param } from '@nestjs/common';
import { GetOrdersByMerchantUseCase } from '../../application/use-cases';
import { Order } from '../../domain/entities';

@Controller('merchants/:merchantId/orders')
export class GetOrdersByMerchantController {
  constructor(
    private readonly getOrdersByMerchantUseCase: GetOrdersByMerchantUseCase,
  ) {}

  @Get()
  async execute(@Param('merchantId') merchantId: string): Promise<Order[]> {
    return this.getOrdersByMerchantUseCase.execute(merchantId);
  }
}
