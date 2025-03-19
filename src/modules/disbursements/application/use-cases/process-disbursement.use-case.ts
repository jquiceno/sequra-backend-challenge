import { OrderRepository } from '@modules/orders/domain/repositories';
import { DisbursementRepository } from '@modules/disbursements/domain/repositories';
import { OrderStatus } from '@modules/orders/domain/enums';
import { ProcessDisbursementDto } from '../dtos/process-disbursement.dto';
import { Disbursement } from '../../domain/entities/disbursement.entity';

export class ProcessDisbursementUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly disbursementRepository: DisbursementRepository,
  ) {}

  async execute(dto: ProcessDisbursementDto): Promise<Disbursement | null> {
    const { merchantId, startDate, endDate } = dto;

    if (endDate < startDate) {
      throw new Error('End date must be after start date');
    }

    const pendingOrders =
      await this.orderRepository.findByMerchantIdAndDateRangeAndStatus(
        merchantId,
        startDate,
        endDate,
        OrderStatus.PENDING,
      );

    if (!pendingOrders.length) return null;

    const totalAmount = pendingOrders.reduce(
      (sum, order) => sum + order.amount,
      0,
    );

    const disbursement = new Disbursement({
      merchantId,
      totalAmount,
    });

    const savedDisbursement =
      await this.disbursementRepository.create(disbursement);

    await Promise.all(
      pendingOrders.map((order) => {
        order.updateStatus(OrderStatus.DISBURSED);
        return this.orderRepository.update(order);
      }),
    );

    return savedDisbursement;
  }
}
