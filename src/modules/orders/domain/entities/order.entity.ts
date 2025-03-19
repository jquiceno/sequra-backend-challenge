import { v4 as uuidv4 } from 'uuid';
import { Amount } from '../value-objects';
import { OrderStatus } from '../enums/order-status.enum';

export class Order {
  public readonly id: string;
  public readonly merchantId: string;
  public readonly amount: number;
  public readonly createdAt: Date;
  public updatedAt: Date;
  private status: OrderStatus;

  constructor(props: {
    id?: string;
    merchantId: string;
    amount: number;
    status?: OrderStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const {
      id,
      merchantId,
      amount,
      status = OrderStatus.PENDING,
      createdAt,
      updatedAt,
    } = props;

    if (!merchantId) {
      throw new Error('Merchant ID is required');
    }

    const date = new Date();
    const newAmount = new Amount(amount);

    this.id = id || uuidv4();
    this.merchantId = merchantId;
    this.amount = newAmount.getValue();
    this.createdAt = createdAt || date;
    this.updatedAt = updatedAt || date;
    this.status = status;
  }

  public updateStatus(newStatus: OrderStatus): Order {
    if (!Object.values(OrderStatus).includes(newStatus)) {
      throw new Error('Invalid order status');
    }

    if (this.status === OrderStatus.DISBURSED) {
      throw new Error('Order is already disbursed');
    }

    this.status = newStatus;
    this.updatedAt = new Date();
    return this;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }
}
