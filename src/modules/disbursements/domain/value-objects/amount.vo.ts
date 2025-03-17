export class Amount {
  constructor(private readonly value: number) {
    if (value <= 0) {
      throw new Error('Amount must be greater than 0');
    }
  }

  getValue(): number {
    return this.value;
  }
}
