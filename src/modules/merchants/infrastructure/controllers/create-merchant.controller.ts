import { Controller, Post, Body } from '@nestjs/common';
import { CreateMerchantUseCase } from '../../application/use-cases/create-merchant.use-case';
import { CreateMerchantDto } from '../../application/dtos/create-merchant.dto';
import { Merchant } from '../../domain/entities';

@Controller('merchants')
export class CreateMerchantController {
  constructor(private readonly createMerchantUseCase: CreateMerchantUseCase) {}

  @Post()
  async execute(
    @Body() createMerchantDto: CreateMerchantDto,
  ): Promise<Merchant> {
    return this.createMerchantUseCase.execute(createMerchantDto);
  }
}
