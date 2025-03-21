import { Order } from '../entities';
import { OrderStatus } from '../enums';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<Order>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findByMerchantId(merchantId: string): Promise<Order[]>;
  abstract findAll(): Promise<Order[]>;
  abstract update(order: Order): Promise<Order>;
  abstract findByMerchantIdAndDateRangeAndStatus(
    merchantId: string,
    startDate: Date,
    endDate: Date,
    status: OrderStatus,
  ): Promise<Order[]>;
}
