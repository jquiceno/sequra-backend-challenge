import { Disbursement } from '@modules/disbursements/domain/entities';

describe('Disbursement Entity', () => {
  it('should create a valid disbursement', () => {
    const disbursement = new Disbursement({
      merchantId: 'merchant-123',
      totalAmount: 1000,
      fee: 100,
    });

    expect(disbursement).toBeDefined();
    expect(disbursement.id).toBeDefined();
    expect(disbursement.merchantId).toBe('merchant-123');
    expect(disbursement.totalAmount).toBe(1000);
    expect(disbursement.fee).toBe(100);
    expect(disbursement.reference).toMatch(/^DISB-MERC-\d{4}-\d{2}-\d{2}$/);
    expect(disbursement.createdAt).toBeInstanceOf(Date);
    expect(disbursement.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw error when merchantId is missing', () => {
    expect(
      () =>
        new Disbursement({
          merchantId: '',
          totalAmount: 1000,
          fee: 100,
        }),
    ).toThrow('Merchant ID is required');
  });

  it('should throw error when totalAmount is zero', () => {
    expect(
      () =>
        new Disbursement({
          merchantId: 'merchant-123',
          totalAmount: 0,
          fee: 100,
        }),
    ).toThrow('Amount must be greater than 0');
  });

  it('should throw error when totalAmount is negative', () => {
    expect(
      () =>
        new Disbursement({
          merchantId: 'merchant-123',
          totalAmount: -1,
          fee: 100,
        }),
    ).toThrow('Amount must be greater than 0');
  });

  it('should throw error when fee is negative', () => {
    expect(
      () =>
        new Disbursement({
          merchantId: 'merchant-123',
          totalAmount: 1000,
          fee: -1,
        }),
    ).toThrow('Fee cannot be negative');
  });

  it('should throw error when fee is greater than totalAmount', () => {
    expect(
      () =>
        new Disbursement({
          merchantId: 'merchant-123',
          totalAmount: 1000,
          fee: 2000,
        }),
    ).toThrow('Fee cannot be greater than total amount');
  });
});
