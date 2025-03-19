import { createOrderMock } from '../../__mocks__/order.mock';
import { OrderStatus } from '../../../domain/enums';

describe('Order Entity', () => {
  it('should create a valid order', () => {
    const order = createOrderMock();

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
    expect(order.merchantId).toBe('merchant-123');
    expect(order.amount).toBe(1000);
    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.updatedAt).toBeInstanceOf(Date);
    expect(order.getStatus()).toBe(OrderStatus.PENDING);
  });

  it('should create an order with custom values', () => {
    const customId = 'custom-id-123';
    const customDate = new Date('2024-01-01');
    const order = createOrderMock({
      id: customId,
      createdAt: customDate,
      updatedAt: customDate,
      merchantId: 'custom-merchant',
      amount: 2000,
      status: OrderStatus.DISBURSED,
    });

    expect(order.id).toBe(customId);
    expect(order.createdAt).toBe(customDate);
    expect(order.updatedAt).toBe(customDate);
    expect(order.merchantId).toBe('custom-merchant');
    expect(order.amount).toBe(2000);
    expect(order.getStatus()).toBe(OrderStatus.DISBURSED);
  });

  it('should throw error when merchantId is missing', () => {
    expect(() => createOrderMock({ merchantId: '' })).toThrow(
      'Merchant ID is required',
    );
  });

  it('should throw error when amount is zero', () => {
    expect(() => createOrderMock({ amount: 0 })).toThrow(
      'Amount must be greater than 0',
    );
  });

  it('should throw error when amount is negative', () => {
    expect(() => createOrderMock({ amount: -1 })).toThrow(
      'Amount must be greater than 0',
    );
  });

  describe('updateStatus', () => {
    it('should update status successfully', () => {
      const order = createOrderMock();
      const newStatus = OrderStatus.DISBURSED;

      order.updateStatus(newStatus);

      expect(order.getStatus()).toBe(newStatus);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error when status is invalid', () => {
      const order = createOrderMock();
      const invalidStatus = 'INVALID_STATUS' as OrderStatus;

      expect(() => order.updateStatus(invalidStatus)).toThrow(
        'Invalid order status',
      );
    });

    it('should throw error when order is already disbursed', () => {
      const order = createOrderMock({
        status: OrderStatus.DISBURSED,
      });

      expect(() => order.updateStatus(OrderStatus.PENDING)).toThrow(
        'Order is already disbursed',
      );
    });

    it('should allow updating status multiple times', () => {
      const order = createOrderMock();
      const firstUpdate = OrderStatus.DISBURSED;

      order.updateStatus(firstUpdate);
      expect(order.getStatus()).toBe(firstUpdate);
    });
  });
});
