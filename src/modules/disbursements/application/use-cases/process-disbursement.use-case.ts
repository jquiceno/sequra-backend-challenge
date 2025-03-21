import { OrderRepository } from '@modules/orders/domain/repositories';
import { DisbursementRepository } from '@modules/disbursements/domain/repositories';
import { OrderStatus } from '@modules/orders/domain/enums';
import { DisbursementFrequency } from '@modules/merchants/domain/enums';
import { Disbursement } from '../../domain/entities/disbursement.entity';
import { MerchantRepository } from '@modules/merchants/domain/repositories';
import { GetDateRangesByFrequencyStrategy } from '../../domain/strategies';

export class ProcessDisbursementUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly disbursementRepository: DisbursementRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly dateRangesStrategy: GetDateRangesByFrequencyStrategy,
  ) {}

  async execute(frequency: DisbursementFrequency): Promise<Disbursement[]> {
    const merchants =
      await this.merchantRepository.findByDisbursementFrequency(frequency);
    const dateRange = this.dateRangesStrategy.execute(frequency);
    const disbursements: Disbursement[] = [];

    for (const merchant of merchants) {
      const pendingOrders =
        await this.orderRepository.findByMerchantIdAndDateRangeAndStatus(
          merchant.id,
          dateRange.startDate,
          dateRange.endDate,
          OrderStatus.PENDING,
        );

      if (!pendingOrders.length) continue;

      const totalAmount = pendingOrders.reduce(
        (sum, order) => sum + order.amount,
        0,
      );

      const disbursement = new Disbursement({
        merchantId: merchant.id,
        totalAmount,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const savedDisbursement =
        await this.disbursementRepository.create(disbursement);

      await Promise.all(
        pendingOrders.map((order) => {
          order.updateStatus(OrderStatus.DISBURSED);
          return this.orderRepository.update(order);
        }),
      );

      disbursements.push(savedDisbursement);
    }

    return disbursements;
  }
}
