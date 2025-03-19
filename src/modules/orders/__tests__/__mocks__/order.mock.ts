import { Order } from '@modules/orders/domain/entities';
import { OrderStatus } from '@modules/orders/domain/enums';

interface CreateOrderMockProps {
  merchantId?: string;
  amount?: number;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: OrderStatus;
}

export const createOrderMock = ({
  merchantId = 'merchant-123',
  amount = 1000,
  id = 'mock-id',
  createdAt = new Date(),
  updatedAt = new Date(),
  status = OrderStatus.PENDING,
}: CreateOrderMockProps = {}): Order => {
  const order = new Order({
    merchantId,
    amount,
    id,
    createdAt,
    updatedAt,
    status,
  });

  return order;
};
