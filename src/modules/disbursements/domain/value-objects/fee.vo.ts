export class Fee {
  private readonly value: number;
  private readonly FEE_RATES = [
    { max: 50, rate: 0.01 },
    { max: 300, rate: 0.0095 },
    { max: Infinity, rate: 0.0085 },
  ];

  constructor(private readonly totalAmount: number) {
    if (!totalAmount) throw new Error('Total amount is required');

    if (totalAmount < 0) {
      throw new Error('Fee cannot be negative');
    }

    const rate = this.FEE_RATES.find((rule) => totalAmount <= rule.max)!.rate;
    this.value = parseFloat((totalAmount * rate).toFixed(2));
  }

  getValue(): number {
    return this.value;
  }
}
