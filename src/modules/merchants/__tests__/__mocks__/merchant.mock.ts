import { Merchant } from '@modules/merchants/domain/entities';
import { DisbursementFrequency } from '@modules/merchants/domain/enums';
import { v4 as uuidv4 } from 'uuid';

export const createMerchantMock = (props?: Partial<Merchant>): Merchant => {
  return new Merchant({
    id: uuidv4(),
    reference: 'MERCH-123',
    email: 'merchant@example.com',
    disbursementFrequency: DisbursementFrequency.DAILY,
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
