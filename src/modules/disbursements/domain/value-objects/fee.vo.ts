import { Amount } from './amount.vo';

export class Fee {
  constructor(
    private readonly value: number,
    private readonly totalAmount: Amount,
  ) {
    if (value < 0) {
      throw new Error('Fee cannot be negative');
    }
    if (value > totalAmount.getValue()) {
      throw new Error('Fee cannot be greater than total amount');
    }
  }

  getValue(): number {
    return this.value;
  }
}
