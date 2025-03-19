import { Reference } from '@modules/disbursements/domain/value-objects';

describe('Reference Value Object', () => {
  it('should create a valid reference', () => {
    const merchantId = 'merchant123';
    const date = new Date('2024-01-15');
    const reference = new Reference(merchantId, date);
    expect(reference.getValue()).toBe('DISB-MERC-2024-01-15');
  });

  it('should handle merchant ID with less than 4 characters', () => {
    const merchantId = 'abc';
    const date = new Date('2024-01-15');
    const reference = new Reference(merchantId, date);
    expect(reference.getValue()).toBe('DISB-ABC-2024-01-15');
  });

  it('should handle merchant ID with more than 4 characters', () => {
    const merchantId = 'merchant123456';
    const date = new Date('2024-01-15');
    const reference = new Reference(merchantId, date);
    expect(reference.getValue()).toBe('DISB-MERC-2024-01-15');
  });

  it('should convert merchant ID prefix to uppercase', () => {
    const merchantId = 'merchant123';
    const date = new Date('2024-01-15');
    const reference = new Reference(merchantId, date);
    expect(reference.getValue()).toBe('DISB-MERC-2024-01-15');
  });

  it('should format date correctly', () => {
    const merchantId = 'merchant123';
    const date = new Date('2024-12-31');
    const reference = new Reference(merchantId, date);
    expect(reference.getValue()).toBe('DISB-MERC-2024-12-31');
  });

  it('should throw error when merchant ID is empty', () => {
    const date = new Date('2024-01-15');
    expect(() => new Reference('', date)).toThrow('Merchant ID is required');
  });

  it('should throw error when merchant ID is undefined', () => {
    const date = new Date('2024-01-15');
    expect(() => new Reference(undefined as any, date)).toThrow(
      'Merchant ID is required',
    );
  });

  it('should throw error when date is undefined', () => {
    const merchantId = 'merchant123';
    expect(() => new Reference(merchantId, undefined as any)).toThrow(
      'Date is required',
    );
  });

  it('should throw error when date is null', () => {
    const merchantId = 'merchant123';
    expect(() => new Reference(merchantId, null as any)).toThrow(
      'Date is required',
    );
  });
});
