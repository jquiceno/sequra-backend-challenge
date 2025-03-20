import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetMerchantByIdUseCase } from '../../application/use-cases/get-merchant-by-id.use-case';
import { Merchant } from '../../domain/entities';

@Controller('merchants')
export class GetMerchantByIdController {
  constructor(
    private readonly getMerchantByIdUseCase: GetMerchantByIdUseCase,
  ) {}

  @Get(':id')
  async execute(@Param('id') id: string): Promise<Merchant | null> {
    const merchant = await this.getMerchantByIdUseCase.execute(id);

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }
}
