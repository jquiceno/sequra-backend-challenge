import { OrderRepository } from '@modules/orders/domain/repositories';
import { CreateOrderUseCase } from '@modules/orders/application/use-cases';
import { createOrderMock } from '../../__mocks__/order.mock';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
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

    useCase = new CreateOrderUseCase(mockOrderRepository);
  });

  it('should create an order successfully', async () => {
    const createOrderDto = {
      merchantId: 'merchant-123',
      amount: 1000,
    };

    const expectedOrder = createOrderMock({
      merchantId: createOrderDto.merchantId,
      amount: createOrderDto.amount,
    });

    mockOrderRepository.create.mockResolvedValue(expectedOrder);

    const result = await useCase.execute(createOrderDto);

    expect(result).toEqual(expectedOrder);
    expect(mockOrderRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        merchantId: createOrderDto.merchantId,
        amount: createOrderDto.amount,
      }),
    );
  });

  it('should throw error when repository fails', async () => {
    const createOrderDto = {
      merchantId: 'merchant-123',
      amount: 1000,
    };

    const error = new Error('Database error');
    mockOrderRepository.create.mockRejectedValue(error);

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(error);
  });
});
