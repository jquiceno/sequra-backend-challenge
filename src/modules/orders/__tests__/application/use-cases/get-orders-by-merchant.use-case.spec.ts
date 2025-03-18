import { GetOrdersByMerchantUseCase } from '@modules/orders/application/use-cases';
import { OrderRepository } from '@modules/orders/domain/repositories';
import { createOrderMock } from '../../__mocks__/order.mock';

describe('GetOrdersByMerchantUseCase', () => {
  let useCase: GetOrdersByMerchantUseCase;
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

    useCase = new GetOrdersByMerchantUseCase(mockOrderRepository);
  });

  it('should return all orders for a merchant', async () => {
    const merchantId = 'merchant-123';
    const expectedOrders = [
      createOrderMock({ merchantId, amount: 1000 }),
      createOrderMock({ merchantId, amount: 2000 }),
    ];

    mockOrderRepository.findByMerchantId.mockResolvedValue(expectedOrders);

    const result = await useCase.execute(merchantId);

    expect(result).toEqual(expectedOrders);
    expect(mockOrderRepository.findByMerchantId).toHaveBeenCalledWith(
      merchantId,
    );
  });

  it('should return empty array when merchant has no orders', async () => {
    const merchantId = 'merchant-123';
    mockOrderRepository.findByMerchantId.mockResolvedValue([]);

    const result = await useCase.execute(merchantId);

    expect(result).toEqual([]);
    expect(mockOrderRepository.findByMerchantId).toHaveBeenCalledWith(
      merchantId,
    );
  });

  it('should throw error when repository fails', async () => {
    const merchantId = 'merchant-123';
    const error = new Error('Database error');
    mockOrderRepository.findByMerchantId.mockRejectedValue(error);

    await expect(useCase.execute(merchantId)).rejects.toThrow(error);
  });
});
