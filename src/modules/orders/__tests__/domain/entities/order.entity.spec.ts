import { createOrderMock } from '../../__mocks__/order.mock';

describe('Order Entity', () => {
  it('should create a valid order', () => {
    const order = createOrderMock();

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
    expect(order.merchantId).toBe('merchant-123');
    expect(order.amount).toBe(1000);
    expect(order.createdAt).toBeInstanceOf(Date);
  });

  it('should create an order with custom values', () => {
    const customId = 'custom-id-123';
    const customDate = new Date('2024-01-01');
    const order = createOrderMock({
      id: customId,
      createdAt: customDate,
      merchantId: 'custom-merchant',
      amount: 2000,
    });

    expect(order.id).toBe(customId);
    expect(order.createdAt).toBe(customDate);
    expect(order.merchantId).toBe('custom-merchant');
    expect(order.amount).toBe(2000);
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
});
