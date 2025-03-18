import { Order } from '@modules/orders/domain/entities';

interface CreateOrderMockProps {
  merchantId?: string;
  amount?: number;
  id?: string;
  createdAt?: Date;
}

export const createOrderMock = ({
  merchantId = 'merchant-123',
  amount = 1000,
  id,
  createdAt = new Date(),
}: CreateOrderMockProps = {}): Order => {
  const order = new Order({
    merchantId,
    amount,
  });

  if (id) {
    Object.defineProperty(order, 'id', { value: id });
  }
  if (createdAt) {
    Object.defineProperty(order, 'createdAt', { value: createdAt });
  }

  return order;
};
