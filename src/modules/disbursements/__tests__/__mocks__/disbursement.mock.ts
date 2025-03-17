import { Disbursement } from '../../domain/entities/disbursement.entity';

export const createDisbursementMock = (
  props?: Partial<Disbursement>,
): Disbursement => {
  const defaultProps = {
    id: '123',
    merchantId: 'merchant-123',
    totalAmount: 1000,
    fee: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return new Disbursement({
    ...defaultProps,
    ...props,
  });
};

export const createDisbursementListMock = (count: number): Disbursement[] => {
  return Array.from({ length: count }, (_, index) =>
    createDisbursementMock({
      id: `123-${index}`,
      merchantId: `merchant-${index}`,
      totalAmount: 1000 + index,
      fee: 100 + index,
    }),
  );
};
