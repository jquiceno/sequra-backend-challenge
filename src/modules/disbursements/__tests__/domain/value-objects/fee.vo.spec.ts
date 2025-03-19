import { Fee } from '@modules/disbursements/domain/value-objects';

describe('Fee Value Object', () => {
  it('should calculate fee correctly for amount less than 50', () => {
    const fee = new Fee(40);
    expect(fee.getValue()).toBe(0.4); // 1% of 40
  });

  it('should calculate fee correctly for amount between 50 and 300', () => {
    const fee = new Fee(200);
    expect(fee.getValue()).toBe(1.9); // 0.95% of 200
  });

  it('should calculate fee correctly for amount greater than 300', () => {
    const fee = new Fee(1000);
    expect(fee.getValue()).toBe(8.5); // 0.85% of 1000
  });

  it('should round fee to 2 decimal places', () => {
    const fee = new Fee(100);
    expect(fee.getValue()).toBe(0.95); // 0.95% of 100, rounded to 2 decimals
  });

  it('should throw error when amount is negative', () => {
    expect(() => new Fee(-100)).toThrow('Fee cannot be negative');
  });

  it('should handle edge case at 50', () => {
    const fee = new Fee(50);
    expect(fee.getValue()).toBe(0.5); // 1% of 50 (using first rate)
  });

  it('should handle edge case at 300', () => {
    const fee = new Fee(300);
    expect(fee.getValue()).toBe(2.85); // 0.95% of 300 (using second rate)
  });
});
