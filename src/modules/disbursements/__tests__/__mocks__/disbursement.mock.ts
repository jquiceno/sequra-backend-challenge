import { Disbursement } from '../../domain/entities/disbursement.entity';

type DisbursementProps = {
  id?: string;
  merchantId: string;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
};

export const createDisbursementMock = (
  props?: Partial<DisbursementProps>,
): Disbursement => {
  const defaultProps: DisbursementProps = {
    id: '123',
    merchantId: 'merchant-123',
    totalAmount: 1000,
    startDate: new Date(),
    endDate: new Date(),
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
    }),
  );
};
