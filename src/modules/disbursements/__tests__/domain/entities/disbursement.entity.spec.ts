import { Disbursement } from '@modules/disbursements/domain/entities';

describe('Disbursement Entity', () => {
  it('should create a valid disbursement', () => {
    const disbursement = new Disbursement({
      merchantId: 'merchant-123',
      totalAmount: 1000,
    });

    expect(disbursement).toBeDefined();
    expect(disbursement.id).toBeDefined();
    expect(disbursement.merchantId).toBe('merchant-123');
    expect(disbursement.totalAmount).toBe(1000);
    expect(disbursement.fee).toBeDefined();
    expect(disbursement.reference).toBeDefined();
    expect(disbursement.createdAt).toBeInstanceOf(Date);
    expect(disbursement.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw error when merchantId is missing', () => {
    expect(
      () =>
        new Disbursement({
          merchantId: '',
          totalAmount: 1000,
        }),
    ).toThrow('Merchant ID is required');
  });

  it('should throw error when totalAmount is zero', () => {
    expect(
      () =>
        new Disbursement({
          merchantId: 'merchant-123',
          totalAmount: 0,
        }),
    ).toThrow('Amount must be greater than 0');
  });

  it('should throw error when totalAmount is negative', () => {
    expect(
      () =>
        new Disbursement({
          merchantId: 'merchant-123',
          totalAmount: -1,
        }),
    ).toThrow('Amount must be greater than 0');
  });

  it('should throw error when totalAmount is undefined', () => {
    expect(
      () =>
        new Disbursement({
          merchantId: 'merchant-123',
          totalAmount: undefined as unknown as number,
        }),
    ).toThrow('Total amount is required');
  });

  it('should throw error when totalAmount is null', () => {
    expect(
      () =>
        new Disbursement({
          merchantId: 'merchant-123',
          totalAmount: null as unknown as number,
        }),
    ).toThrow('Total amount is required');
  });
});
