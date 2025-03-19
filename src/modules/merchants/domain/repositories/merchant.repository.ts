import { Merchant } from '../entities';

export abstract class MerchantRepository {
  abstract create(merchant: Merchant): Promise<Merchant>;
  abstract findById(id: string): Promise<Merchant | null>;
  abstract findByEmail(email: string): Promise<Merchant | null>;
  abstract findAll(): Promise<Merchant[]>;
}
