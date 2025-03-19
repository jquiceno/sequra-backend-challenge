import { Merchant } from '../../domain/entities';
import { MerchantRepository } from '../../domain/repositories';

export class GetAllMerchantsUseCase {
  constructor(private readonly merchantRepository: MerchantRepository) {}

  async execute(): Promise<Merchant[]> {
    return this.merchantRepository.findAll();
  }
}
