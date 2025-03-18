import { DisbursementFrequency } from '@modules/merchants/domain/enums';
import { createMerchantMock } from '../../__mocks__/merchant.mock';

describe('Merchant Entity', () => {
  it('should create a valid merchant', () => {
    const merchant = createMerchantMock();
    expect(merchant).toBeDefined();
    expect(merchant.id).toBeDefined();
    expect(merchant.reference).toBe('MERCH-123');
    expect(merchant.email).toBe('merchant@example.com');
    expect(merchant.disbursementFrequency).toBe('DAILY');
    expect(merchant.minimumMonthlyFee).toBe(100);
    expect(merchant.liveOn).toBeInstanceOf(Date);
  });

  it('should throw error when reference is missing', () => {
    expect(() => createMerchantMock({ reference: '' })).toThrow(
      'Reference is required',
    );
  });

  it('should throw error when email is missing', () => {
    expect(() => createMerchantMock({ email: '' })).toThrow(
      'Email is required',
    );
  });

  it('should throw error when disbursementFrequency is missing', () => {
    expect(() =>
      createMerchantMock({
        disbursementFrequency: undefined as any,
      }),
    ).toThrow('Disbursement frequency is required');
  });

  it('should throw error when minimumMonthlyFee is missing', () => {
    expect(() =>
      createMerchantMock({
        minimumMonthlyFee: undefined as any,
      }),
    ).toThrow('Minimum monthly fee is required');
  });

  it('should accept only valid disbursementFrequency values', () => {
    const merchant = createMerchantMock({
      disbursementFrequency: DisbursementFrequency.WEEKLY,
    });
    expect(merchant.disbursementFrequency).toBe('WEEKLY');
  });
});
