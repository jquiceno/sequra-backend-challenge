import { Order } from '../../domain/entities';
import { OrderRepository } from '../../domain/repositories';

export class GetOrdersByMerchantUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(merchantId: string): Promise<Order[]> {
    if (!merchantId) {
      throw new Error('Merchant ID is required');
    }

    return this.orderRepository.findByMerchantId(merchantId);
  }
}
