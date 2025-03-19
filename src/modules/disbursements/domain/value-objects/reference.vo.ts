export class Reference {
  private readonly value: string;

  constructor(merchantId: string, date: Date) {
    if (!merchantId) throw new Error('Merchant ID is required');
    if (!date) throw new Error('Date is required');

    this.value = this.generateReference(merchantId, date);
  }

  private generateReference(merchantId: string, date: Date): string {
    const merchantPrefix = merchantId.substring(0, 4).toUpperCase();
    const dateStr = date.toISOString().split('T')[0];
    return `DISB-${merchantPrefix}-${dateStr}`;
  }

  getValue(): string {
    return this.value;
  }
}
