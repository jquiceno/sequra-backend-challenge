import { Amount, Fee } from '@modules/disbursements/domain/value-objects/';

describe('Fee Value Object', () => {
  const totalAmount = new Amount(1000);

  it('should create a valid fee', () => {
    const fee = new Fee(100, totalAmount);
    expect(fee.getValue()).toBe(100);
  });

  it('should throw error when fee is negative', () => {
    expect(() => new Fee(-1, totalAmount)).toThrow('Fee cannot be negative');
  });

  it('should throw error when fee is greater than total amount', () => {
    expect(() => new Fee(2000, totalAmount)).toThrow(
      'Fee cannot be greater than total amount',
    );
  });
});
