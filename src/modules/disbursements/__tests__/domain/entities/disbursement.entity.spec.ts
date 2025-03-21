import { Disbursement } from '@modules/disbursements/domain/entities';
import {
  Amount,
  Fee,
  Reference,
} from '@modules/disbursements/domain/value-objects';

describe('Disbursement', () => {
  const validProps = {
    merchantId: 'merchant-123',
    totalAmount: 1000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
  };

  describe('creation', () => {
    it('should create a disbursement with valid properties', () => {
      const disbursement = new Disbursement(validProps);

      expect(disbursement).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          merchantId: validProps.merchantId,
          totalAmount: expect.any(Amount),
          fee: expect.any(Fee),
          reference: expect.any(Reference),
          startDate: validProps.startDate,
          endDate: validProps.endDate,
          createdAt: expect.any(Date),
        }),
      );
    });

    it('should create a disbursement with a custom id', () => {
      const customId = 'custom-id-123';
      const disbursement = new Disbursement({ ...validProps, id: customId });

      expect(disbursement.id).toBe(customId);
    });

    it('should generate a UUID when no id is provided', () => {
      const disbursement = new Disbursement(validProps);

      expect(disbursement.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should set createdAt to current date', () => {
      const before = new Date();
      const disbursement = new Disbursement(validProps);
      const after = new Date();

      expect(disbursement.createdAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(disbursement.createdAt.getTime()).toBeLessThanOrEqual(
        after.getTime(),
      );
    });
  });

  describe('value objects', () => {
    it('should create Amount value object with totalAmount', () => {
      const disbursement = new Disbursement(validProps);

      expect(disbursement.totalAmount).toBeInstanceOf(Amount);
      expect(disbursement.totalAmount.getValue()).toBe(validProps.totalAmount);
    });

    it('should create Fee value object based on totalAmount', () => {
      const disbursement = new Disbursement(validProps);
      const expectedFee = new Fee(validProps.totalAmount);

      expect(disbursement.fee).toBeInstanceOf(Fee);
      expect(disbursement.fee.getValue()).toBe(expectedFee.getValue());
    });

    it('should create Reference value object with merchantId and current date', () => {
      const disbursement = new Disbursement(validProps);
      const today = new Date().toISOString().split('T')[0];

      expect(disbursement.reference).toBeInstanceOf(Reference);
      expect(disbursement.reference.getValue()).toMatch(
        new RegExp(
          `^DISB-${validProps.merchantId.substring(0, 4).toUpperCase()}-${today}$`,
        ),
      );
    });
  });

  describe('methods', () => {
    describe('getReference', () => {
      it('should return the reference string value', () => {
        const disbursement = new Disbursement(validProps);
        const referenceValue = disbursement.reference.getValue();

        expect(disbursement.getReference()).toBe(referenceValue);
      });
    });
  });

  describe('date handling', () => {
    it('should store startDate as provided', () => {
      const disbursement = new Disbursement(validProps);

      expect(disbursement.startDate).toBe(validProps.startDate);
    });

    it('should store endDate as provided', () => {
      const disbursement = new Disbursement(validProps);

      expect(disbursement.endDate).toBe(validProps.endDate);
    });
  });

  describe('validation', () => {
    describe('merchantId', () => {
      it('should throw error when merchantId is empty', () => {
        expect(
          () => new Disbursement({ ...validProps, merchantId: '' }),
        ).toThrow('Merchant ID is required');
      });

      it('should throw error when merchantId is missing', () => {
        const { merchantId: _, ...propsWithoutMerchantId } = validProps;
        expect(() => new Disbursement(propsWithoutMerchantId as any)).toThrow(
          'Merchant ID is required',
        );
      });
    });

    describe('totalAmount', () => {
      it('should throw error when totalAmount is zero', () => {
        expect(
          () => new Disbursement({ ...validProps, totalAmount: 0 }),
        ).toThrow('Total amount is required');
      });

      it('should throw error when totalAmount is negative', () => {
        expect(
          () => new Disbursement({ ...validProps, totalAmount: -100 }),
        ).toThrow('Amount must be greater than 0');
      });

      it('should throw error when totalAmount is missing', () => {
        const { totalAmount: _, ...propsWithoutAmount } = validProps;
        expect(() => new Disbursement(propsWithoutAmount as any)).toThrow(
          'Total amount is required',
        );
      });
    });

    describe('dates', () => {
      it('should throw error when startDate is missing', () => {
        const { startDate: _, ...propsWithoutStartDate } = validProps;
        expect(() => new Disbursement(propsWithoutStartDate as any)).toThrow(
          'Start date is required',
        );
      });

      it('should throw error when endDate is missing', () => {
        const { endDate: _, ...propsWithoutEndDate } = validProps;
        expect(() => new Disbursement(propsWithoutEndDate as any)).toThrow(
          'End date is required',
        );
      });

      it('should throw error when endDate is before startDate', () => {
        expect(
          () =>
            new Disbursement({
              ...validProps,
              startDate: new Date('2024-01-31'),
              endDate: new Date('2024-01-01'),
            }),
        ).toThrow('End date must be after start date');
      });

      it('should throw error when startDate is not a Date', () => {
        expect(
          () =>
            new Disbursement({
              ...validProps,
              startDate: 'not-a-date' as any,
            }),
        ).toThrow('Start date must be a valid date');
      });

      it('should throw error when endDate is not a Date', () => {
        expect(
          () =>
            new Disbursement({
              ...validProps,
              endDate: 'not-a-date' as any,
            }),
        ).toThrow('End date must be a valid date');
      });
    });
  });
});
