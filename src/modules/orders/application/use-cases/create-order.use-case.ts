import { Order } from '../../domain/entities';
import { OrderRepository } from '../../domain/repositories';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { MerchantRepository } from '@modules/merchants/domain/repositories';

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly merchantRepository: MerchantRepository,
  ) {}

  async execute(createOrderDto: CreateOrderDto): Promise<Order> {
    const merchant = await this.merchantRepository.findById(
      createOrderDto.merchantId,
    );

    if (!merchant) {
      throw new Error('Merchant not found');
    }

    const order = new Order({
      merchantId: createOrderDto.merchantId,
      amount: createOrderDto.amount,
    });

    return this.orderRepository.create(order);
  }
}
