import { Order } from '@modules/orders/domain/entities';
import { OrderStatus } from '@modules/orders/domain/enums';

interface CreateOrderMockProps {
  merchantId?: string;
  amount?: number;
  id?: string;
  createdAt?: Date;
  status?: OrderStatus;
}

export const createOrderMock = ({
  merchantId = 'merchant-123',
  amount = 1000,
  id,
  createdAt = new Date(),
  status = OrderStatus.PENDING,
}: CreateOrderMockProps = {}): Order => {
  const order = new Order({
    merchantId,
    amount,
  });

  // Override readonly properties using Object.defineProperty
  if (id) {
    Object.defineProperty(order, 'id', { value: id });
  }
  if (createdAt) {
    Object.defineProperty(order, 'createdAt', { value: createdAt });
  }
  if (status) {
    Object.defineProperty(order, 'status', { value: status });
  }

  return order;
};
