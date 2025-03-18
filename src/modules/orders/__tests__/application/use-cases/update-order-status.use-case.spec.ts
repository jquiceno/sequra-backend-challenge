import { UpdateOrderStatusUseCase } from '@modules/orders/application/use-cases';
import { OrderRepository } from '@modules/orders/domain/repositories';
import { createOrderMock } from '../../__mocks__/order.mock';
import { OrderStatus } from '@modules/orders/domain/enums';

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase;
  let mockOrderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByMerchantId: jest.fn(),
      findAll: jest.fn(),
      findByMerchantIdAndDateRange: jest.fn(),
      update: jest.fn(),
    };

    useCase = new UpdateOrderStatusUseCase(mockOrderRepository);
  });

  it('should update order status successfully', async (): Promise<void> => {
    const orderId = 'order-123';
    const order = createOrderMock({ id: orderId });
    const updatedOrder = createOrderMock({
      id: orderId,
      status: OrderStatus.PROCESSING,
    });

    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.update.mockResolvedValue(updatedOrder);

    const result = await useCase.execute({
      orderId,
      status: OrderStatus.PROCESSING,
    });

    expect(result).toEqual(updatedOrder);
    expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
    expect(mockOrderRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: orderId,
        status: OrderStatus.PROCESSING,
      }),
    );
  });

  it('should throw error when order not found', async (): Promise<void> => {
    const orderId = 'order-123';
    mockOrderRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        orderId,
        status: OrderStatus.PROCESSING,
      }),
    ).rejects.toThrow('Order not found');
  });

  it('should throw error when repository fails', async (): Promise<void> => {
    const orderId = 'order-123';
    const order = createOrderMock({ id: orderId });
    const error = new Error('Database error');

    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.update.mockRejectedValue(error);

    await expect(
      useCase.execute({
        orderId,
        status: OrderStatus.PROCESSING,
      }),
    ).rejects.toThrow(error);
  });
});
