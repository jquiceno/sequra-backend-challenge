import { Controller, Get } from '@nestjs/common';
import { GetAllMerchantsUseCase } from '../../application/use-cases/get-all-merchants.use-case';
import { Merchant } from '../../domain/entities';

@Controller('merchants')
export class GetAllMerchantsController {
  constructor(
    private readonly getAllMerchantsUseCase: GetAllMerchantsUseCase,
  ) {}

  @Get()
  async execute(): Promise<Merchant[]> {
    return this.getAllMerchantsUseCase.execute();
  }
}
