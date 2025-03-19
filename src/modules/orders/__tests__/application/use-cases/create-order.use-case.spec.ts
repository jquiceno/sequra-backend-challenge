import { OrderRepository } from '@modules/orders/domain/repositories';
import { CreateOrderUseCase } from '@modules/orders/application/use-cases';
import { createOrderMock } from '../../__mocks__/order.mock';
import { OrderStatus } from '@modules/orders/domain/enums';

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
        status: OrderStatus.PENDING,
      }),
    );
  });

  it('should create an order with minimum amount', async () => {
    const createOrderDto = {
      merchantId: 'merchant-123',
      amount: 0.01,
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
        status: OrderStatus.PENDING,
      }),
    );
  });

  it('should create an order with large amount', async () => {
    const createOrderDto = {
      merchantId: 'merchant-123',
      amount: 999999.99,
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
        status: OrderStatus.PENDING,
      }),
    );
  });

  it('should throw error when merchantId is empty', async () => {
    const createOrderDto = {
      merchantId: '',
      amount: 1000,
    };

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(
      'Merchant ID is required',
    );
    expect(mockOrderRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when amount is zero', async () => {
    const createOrderDto = {
      merchantId: 'merchant-123',
      amount: 0,
    };

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(
      'Amount must be greater than 0',
    );
    expect(mockOrderRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when amount is negative', async () => {
    const createOrderDto = {
      merchantId: 'merchant-123',
      amount: -1,
    };

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(
      'Amount must be greater than 0',
    );
    expect(mockOrderRepository.create).not.toHaveBeenCalled();
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
