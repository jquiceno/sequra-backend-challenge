import { Amount } from '@modules/disbursements/domain/value-objects';

describe('Amount Value Object', () => {
  it('should create a valid amount', () => {
    const amount = new Amount(1000);
    expect(amount.getValue()).toBe(1000);
  });

  it('should throw error when amount is zero', () => {
    expect(() => new Amount(0)).toThrow('Amount must be greater than 0');
  });

  it('should throw error when amount is negative', () => {
    expect(() => new Amount(-1)).toThrow('Amount must be greater than 0');
  });
});
