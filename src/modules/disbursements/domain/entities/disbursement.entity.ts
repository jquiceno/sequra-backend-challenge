import { v4 as uuidv4 } from 'uuid';
import { Amount, Fee, Reference } from '../value-objects';

export class Disbursement {
  readonly id: string;
  readonly merchantId: string;
  readonly totalAmount: Amount;
  readonly fee: Fee;
  readonly createdAt: Date;
  readonly reference: Reference;
  readonly startDate: Date;
  readonly endDate: Date;

  constructor(props: {
    id?: string;
    merchantId: string;
    totalAmount: number;
    startDate: Date;
    endDate: Date;
  }) {
    const totalAmount = new Amount(props.totalAmount);
    const fee = new Fee(totalAmount.getValue());
    const reference = new Reference(props.merchantId, new Date());
    const date = new Date();

    this.id = props.id ?? uuidv4();
    this.merchantId = props.merchantId;
    this.totalAmount = totalAmount;
    this.fee = fee;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.createdAt = date;
    this.reference = reference;
  }

  getReference(): string {
    return this.reference.getValue();
  }
}
