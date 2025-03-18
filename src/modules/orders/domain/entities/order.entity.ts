import { v4 as uuidv4 } from 'uuid';
import { Amount } from '../value-objects';
import { OrderStatus } from '../enums';

export class Order {
  public readonly id: string;
  public readonly merchantId: string;
  public readonly amount: number;
  public readonly createdAt: Date;
  private status: OrderStatus;

  constructor(props: { merchantId: string; amount: number }) {
    const { merchantId, amount } = props;

    if (!merchantId) {
      throw new Error('Merchant ID is required');
    }

    const newAmount = new Amount(amount);

    this.id = uuidv4();
    this.merchantId = merchantId;
    this.amount = newAmount.getValue();
    this.createdAt = new Date();
    this.status = OrderStatus.PENDING;
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
  }

  getStatus(): OrderStatus {
    return this.status;
  }
}
