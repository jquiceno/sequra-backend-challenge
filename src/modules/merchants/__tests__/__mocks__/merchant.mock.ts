import { Merchant } from '@modules/merchants/domain/entities';

export const createMerchantMock = (
  props?: Partial<Omit<Merchant, 'id'>>,
): Merchant => {
  return new Merchant({
    reference: 'MERCH-123',
    email: 'merchant@example.com',
    disbursementFrequency: 'DAILY',
    minimumMonthlyFee: 100,
    liveOn: new Date(),
    ...props,
  });
};

export const createMerchantListMock = (count: number): Merchant[] => {
  return Array.from({ length: count }, (_, index) =>
    createMerchantMock({
      reference: `MERCH-${index + 1}`,
      email: `merchant${index + 1}@example.com`,
    }),
  );
};
