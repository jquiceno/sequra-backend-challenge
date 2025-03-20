import { Merchant } from '@modules/merchants/domain/entities';
import { DisbursementFrequency } from '@modules/merchants/domain/enums';
import { v4 as uuidv4 } from 'uuid';

export const createMerchantMock = (
  props?: Partial<Omit<Merchant, 'id' | 'email'>> & {
    id?: string;
    email?: string;
  },
): Merchant => {
  return new Merchant({
    id: uuidv4(),
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
      email: `merchant${index + 1}@example.com`,
    }),
  );
};
