export class Amount {
  private readonly value: number;

  constructor(value: number) {
    if (value <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}
