import { Order } from '../entities';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<Order>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findByMerchantId(merchantId: string): Promise<Order[]>;
  abstract findAll(): Promise<Order[]>;
  abstract findByMerchantIdAndDateRange(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Order[]>;
  abstract update(order: Order): Promise<Order>;
}
