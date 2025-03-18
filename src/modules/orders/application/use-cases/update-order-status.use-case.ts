import { Order } from '../../domain/entities';
import { OrderRepository } from '../../domain/repositories';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.updateStatus(dto.status);
    return this.orderRepository.update(order);
  }
}
