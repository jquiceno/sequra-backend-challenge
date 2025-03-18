import { Merchant } from '../../domain/entities';
import { MerchantRepository } from '../../domain/repositories';
import { CreateMerchantDto } from '../dtos/create-merchant.dto';

export class CreateMerchantUseCase {
  constructor(private readonly merchantRepository: MerchantRepository) {}

  async execute(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    const merchant = new Merchant({
      reference: createMerchantDto.reference,
      email: createMerchantDto.email,
      disbursementFrequency: createMerchantDto.disbursementFrequency,
      minimumMonthlyFee: createMerchantDto.minimumMonthlyFee,
      liveOn: createMerchantDto.liveOn
        ? new Date(createMerchantDto.liveOn)
        : new Date(),
    });

    return this.merchantRepository.create(merchant);
  }
}
