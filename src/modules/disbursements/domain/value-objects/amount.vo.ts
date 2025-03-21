export class Amount {
  constructor(private readonly value: number) {
    if (!value) throw new Error('Total amount is required');

    if (value <= 0) {
      throw new Error('Amount must be greater than 0');
    }
  }

  getValue(): number {
    return this.value;
  }
}
