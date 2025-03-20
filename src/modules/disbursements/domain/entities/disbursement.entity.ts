import { v4 as uuidv4 } from 'uuid';
import { Amount, Fee, Reference } from '../value-objects';

export class Disbursement {
  readonly id: string;
  readonly merchantId: string;
  readonly totalAmount: number;
  readonly fee: Fee;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly reference: Reference;

  constructor(props: { id?: string; merchantId: string; totalAmount: number }) {
    if (!props.merchantId) throw new Error('Merchant ID is required');
    if (props.totalAmount == null) throw new Error('Total amount is required');

    const totalAmount = new Amount(props.totalAmount);
    const fee = new Fee(totalAmount.getValue());
    const reference = new Reference(props.merchantId, new Date());

    const date = new Date();
    this.id = props.id ?? uuidv4();
    this.merchantId = props.merchantId;
    this.totalAmount = totalAmount.getValue();
    this.fee = fee;
    this.createdAt = date;
    this.updatedAt = date;
    this.reference = reference;
  }

  getReference(): string {
    return this.reference.getValue();
  }
}
