import { Disbursement } from '../entities';

export abstract class DisbursementRepository {
  abstract create(disbursement: Disbursement): Promise<Disbursement>;
  abstract findByMerchantAndDate(
    merchantId: string,
    date: Date,
  ): Promise<Disbursement | null>;
  abstract findAll(): Promise<Disbursement[]>;
  abstract findById(id: string): Promise<Disbursement | null>;
}
