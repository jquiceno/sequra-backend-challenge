export class Amount {
  private readonly value: number;

  constructor(value: number) {
    if (value === undefined || value === null) {
      throw new Error('Amount is required');
    }

    if (Number.isNaN(value) || !Number.isFinite(value)) {
      throw new Error('Amount must be a valid number');
    }

    if (value <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}
