import { createDisbursementMock } from '../../__mocks__/disbursement.mock';

describe('Disbursement Entity', () => {
  it('should create a valid disbursement', () => {
    const disbursement = createDisbursementMock();
    expect(disbursement).toBeDefined();
    expect(disbursement.id).toBe('123');
    expect(disbursement.merchantId).toBe('merchant-123');
    expect(disbursement.totalAmount).toBe(1000);
    expect(disbursement.fee).toBe(100);
  });

  it('should throw error when id is missing', () => {
    expect(() => createDisbursementMock({ id: undefined })).toThrow(
      'property id has failed',
    );
  });

  it('should throw error when merchantId is missing', () => {
    expect(() => createDisbursementMock({ merchantId: undefined })).toThrow(
      'property merchantId has failed',
    );
  });

  it('should throw error when totalAmount is missing', () => {
    expect(() => createDisbursementMock({ totalAmount: 0 })).toThrow(
      'Amount must be greater than 0',
    );
  });

  it('should throw error when fee is negative', () => {
    expect(() => createDisbursementMock({ fee: -1 })).toThrow(
      'Fee cannot be negative',
    );
  });

  it('should throw error when fee is greater than totalAmount', () => {
    expect(() => createDisbursementMock({ fee: 2000 })).toThrow(
      'Fee cannot be greater than total amount',
    );
  });
});
