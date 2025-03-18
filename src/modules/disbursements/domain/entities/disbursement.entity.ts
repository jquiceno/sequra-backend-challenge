import { v4 as uuidv4 } from 'uuid';
import { Amount, Fee } from '../value-objects';

export class Disbursement {
  readonly id: string;
  readonly merchantId: string;
  readonly totalAmount: number;
  readonly fee: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly reference: string;

  constructor(props: { merchantId: string; totalAmount: number; fee: number }) {
    if (!props.merchantId) throw new Error('Merchant ID is required');
    if (props.totalAmount == null) throw new Error('Total amount is required');
    if (props.fee == null) throw new Error('Fee is required');

    const totalAmount = new Amount(props.totalAmount);
    const fee = new Fee(props.fee, totalAmount);

    const date = new Date();
    this.id = uuidv4();
    this.merchantId = props.merchantId;
    this.totalAmount = totalAmount.getValue();
    this.fee = fee.getValue();
    this.createdAt = date;
    this.updatedAt = date;
    this.reference = this.generateReference();
  }

  private generateReference(): string {
    return `DISB-${this.merchantId.substring(0, 4).toUpperCase()}-${this.createdAt.toISOString().split('T')[0]}`;
  }
}
