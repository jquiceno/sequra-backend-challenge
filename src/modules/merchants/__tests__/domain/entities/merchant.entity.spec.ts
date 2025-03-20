import { Merchant } from '../../../domain/entities/merchant.entity';
import { DisbursementFrequency } from '../../../domain/enums';
import { Reference } from '../../../domain/value-objects/reference.vo';
import { Email } from '../../../domain/value-objects';

describe('Merchant Entity', () => {
  const validProps = {
    email: 'test@example.com',
    liveOn: new Date('2024-01-01'),
    disbursementFrequency: DisbursementFrequency.DAILY,
    minimumMonthlyFee: 100,
  };

  it('should create a merchant with valid properties', () => {
    const merchant = new Merchant(validProps);

    expect(merchant.id).toBeDefined();
    expect(merchant.getEmail()).toBe(validProps.email);
    expect(merchant.getReference()).toBe(validProps.email.split('@')[0]); // La referencia es la parte local del email
    expect(merchant.liveOn).toBe(validProps.liveOn);
    expect(merchant.disbursementFrequency).toBe(
      validProps.disbursementFrequency,
    );
    expect(merchant.minimumMonthlyFee).toBe(validProps.minimumMonthlyFee);
  });

  it('should create a merchant with a provided ID', () => {
    const customId = 'custom-id-123';
    const merchant = new Merchant({ ...validProps, id: customId });

    expect(merchant.id).toBe(customId);
  });

  it('should throw error when minimum monthly fee is undefined', () => {
    const { minimumMonthlyFee, ...propsWithoutFee } = validProps;

    expect(() => new Merchant(propsWithoutFee as any)).toThrow(
      'Minimum monthly fee is required',
    );
  });

  it('should throw error when disbursement frequency is invalid', () => {
    expect(
      () =>
        new Merchant({
          ...validProps,
          disbursementFrequency: 'INVALID' as DisbursementFrequency,
        }),
    ).toThrow('Invalid disbursement frequency');
  });

  it('should accept WEEKLY as valid disbursement frequency', () => {
    const merchant = new Merchant({
      ...validProps,
      disbursementFrequency: DisbursementFrequency.WEEKLY,
    });

    expect(merchant.disbursementFrequency).toBe(DisbursementFrequency.WEEKLY);
  });

  describe('Value Objects', () => {
    it('should create valid email value object', () => {
      const merchant = new Merchant(validProps);
      expect(merchant.email).toBeInstanceOf(Email);
      expect(merchant.getEmail()).toBe(validProps.email);
    });

    it('should create valid reference value object from email', () => {
      const merchant = new Merchant(validProps);
      expect(merchant.reference).toBeInstanceOf(Reference);
      expect(merchant.getReference()).toBe(validProps.email.split('@')[0]); // La referencia es la parte local del email
    });

    it('should throw error when email is invalid', () => {
      expect(
        () =>
          new Merchant({
            ...validProps,
            email: 'invalid-email',
          }),
      ).toThrow();
    });
  });
});
