import { GetOrdersByDateRangeUseCase } from '@modules/orders/application/use-cases';
import { OrderRepository } from '@modules/orders/domain/repositories';
import { createOrderMock } from '../../__mocks__/order.mock';

describe('GetOrdersByDateRangeUseCase', () => {
  let useCase: GetOrdersByDateRangeUseCase;
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

    useCase = new GetOrdersByDateRangeUseCase(mockOrderRepository);
  });

  it('should return orders within date range', async (): Promise<void> => {
    const merchantId = 'merchant-123';
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
    const expectedOrders = [
      createOrderMock({ merchantId, createdAt: new Date('2024-01-15') }),
      createOrderMock({ merchantId, createdAt: new Date('2024-01-20') }),
    ];

    mockOrderRepository.findByMerchantIdAndDateRange.mockResolvedValue(
      expectedOrders,
    );

    const result = await useCase.execute({
      merchantId,
      startDate,
      endDate,
    });

    expect(result).toEqual(expectedOrders);
    expect(
      mockOrderRepository.findByMerchantIdAndDateRange,
    ).toHaveBeenCalledWith(merchantId, new Date(startDate), new Date(endDate));
  });

  it('should return empty array when no orders found', async (): Promise<void> => {
    const merchantId = 'merchant-123';
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';

    mockOrderRepository.findByMerchantIdAndDateRange.mockResolvedValue([]);

    const result = await useCase.execute({
      merchantId,
      startDate,
      endDate,
    });

    expect(result).toEqual([]);
    expect(
      mockOrderRepository.findByMerchantIdAndDateRange,
    ).toHaveBeenCalledWith(merchantId, new Date(startDate), new Date(endDate));
  });

  it('should throw error when repository fails', async (): Promise<void> => {
    const merchantId = 'merchant-123';
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
    const error = new Error('Database error');

    mockOrderRepository.findByMerchantIdAndDateRange.mockRejectedValue(error);

    await expect(
      useCase.execute({
        merchantId,
        startDate,
        endDate,
      }),
    ).rejects.toThrow(error);
  });
});
