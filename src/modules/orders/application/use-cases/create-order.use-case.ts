import { Order } from '../../domain/entities';
import { OrderRepository } from '../../domain/repositories';
import { CreateOrderDto } from '../dtos/create-order.dto';

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order({
      merchantId: createOrderDto.merchantId,
      amount: createOrderDto.amount,
    });

    return this.orderRepository.create(order);
  }
}
