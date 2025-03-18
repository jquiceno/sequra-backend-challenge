import { Merchant } from '../../domain/entities';
import { MerchantRepository } from '../../domain/repositories';

export class GetMerchantByIdUseCase {
  constructor(private readonly merchantRepository: MerchantRepository) {}

  async execute(id: string): Promise<Merchant | null> {
    return this.merchantRepository.findById(id);
  }
}
