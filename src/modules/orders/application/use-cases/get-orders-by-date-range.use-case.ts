import { Order } from '../../domain/entities';
import { OrderRepository } from '../../domain/repositories';
import { GetOrdersByDateRangeDto } from '../dtos/get-orders-by-date-range.dto';

export class GetOrdersByDateRangeUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(dto: GetOrdersByDateRangeDto): Promise<Order[]> {
    return this.orderRepository.findByMerchantIdAndDateRange(
      dto.merchantId,
      new Date(dto.startDate),
      new Date(dto.endDate),
    );
  }
}
