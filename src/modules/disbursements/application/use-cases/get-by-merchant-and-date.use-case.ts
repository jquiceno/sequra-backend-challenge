import { DisbursementRepository } from '../../domain/repositories';

export class GetByMerchantAndDateUseCase {
  constructor(
    private readonly disbursementRepository: DisbursementRepository,
  ) {}

  execute(merchantId: string, date: Date) {
    return this.disbursementRepository.findByMerchantAndDate(merchantId, date);
  }
}
