import { Disbursement } from '../entities';

export abstract class DisbursementRepository {
  abstract create(disbursement: Disbursement): Promise<string>;
  abstract findByMerchantAndDate(
    merchantId: string,
    date: Date,
  ): Promise<Disbursement | null>;
}
