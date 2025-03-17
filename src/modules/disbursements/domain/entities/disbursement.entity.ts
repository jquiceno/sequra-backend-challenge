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
    if (!props.merchantId) {
      throw new Error('Merchant ID is required');
    }

    const date = new Date();
    const totalAmount = new Amount(props.totalAmount);
    const fee = new Fee(props.fee, totalAmount);

    Object.assign(this, {
      ...props,
      id: uuidv4(),
      totalAmount: totalAmount.getValue(),
      fee: fee.getValue(),
      createdAt: date,
      updatedAt: date,
      reference: this.generateReference(props.merchantId, date),
    });
  }

  generateReference(merchantId: string, date: Date): string {
    return `DISB-${merchantId.substring(0, 4).toUpperCase()}-${date.toISOString().split('T')[0]}`;
  }
}
