import { OrderRepository } from '@modules/orders/domain/repositories';
import { DisbursementRepository } from '@modules/disbursements/domain/repositories';
import { ProcessDisbursementUseCase } from '@modules/disbursements/application/use-cases';
import { createOrderMock } from '@modules/orders/__tests__/__mocks__/order.mock';
import { OrderStatus } from '@modules/orders/domain/enums';
import { createDisbursementMock } from '../../__mocks__/disbursement.mock';

describe('ProcessDisbursementUseCase', () => {
  let useCase: ProcessDisbursementUseCase;
  let mockOrderRepository: jest.Mocked<OrderRepository>;
  let mockDisbursementRepository: jest.Mocked<DisbursementRepository>;

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByMerchantId: jest.fn(),
      findAll: jest.fn(),
      findByMerchantIdAndDateRangeAndStatus: jest.fn(),
      update: jest.fn(),
    };

    mockDisbursementRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByMerchantAndDate: jest.fn(),
    };

    useCase = new ProcessDisbursementUseCase(
      mockOrderRepository,
      mockDisbursementRepository,
    );
  });

  it('should process disbursement successfully', async () => {
    const merchantId = 'merchant-123';
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    const pendingOrders = [
      createOrderMock({ merchantId, amount: 100 }),
      createOrderMock({ merchantId, amount: 200 }),
    ];

    const mockDisbursement = createDisbursementMock({
      merchantId,
      totalAmount: 300,
    });

    mockOrderRepository.findByMerchantIdAndDateRangeAndStatus.mockResolvedValue(
      pendingOrders,
    );
    mockDisbursementRepository.create.mockResolvedValue(mockDisbursement);
    mockOrderRepository.update.mockImplementation((order) =>
      Promise.resolve(order),
    );

    const result = await useCase.execute({
      merchantId,
      startDate,
      endDate,
    });

    expect(result).toEqual(mockDisbursement);
    expect(
      mockOrderRepository.findByMerchantIdAndDateRangeAndStatus,
    ).toHaveBeenCalledWith(merchantId, startDate, endDate, OrderStatus.PENDING);
    expect(mockDisbursementRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        merchantId,
        totalAmount: 300,
      }),
    );
    expect(mockOrderRepository.update).toHaveBeenCalledTimes(2);
    pendingOrders.forEach((order) => {
      expect(mockOrderRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: order.id,
          status: OrderStatus.DISBURSED,
        }),
      );
    });
  });

  it('should return null when no pending orders found', async () => {
    const merchantId = 'merchant-123';
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    mockOrderRepository.findByMerchantIdAndDateRangeAndStatus.mockResolvedValue(
      [],
    );

    const result = await useCase.execute({
      merchantId,
      startDate,
      endDate,
    });

    expect(result).toBeNull();
    expect(mockDisbursementRepository.create).not.toHaveBeenCalled();
    expect(mockOrderRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when endDate is before startDate', async () => {
    const merchantId = 'merchant-123';
    const startDate = new Date('2024-01-31');
    const endDate = new Date('2024-01-01');

    await expect(
      useCase.execute({
        merchantId,
        startDate,
        endDate,
      }),
    ).rejects.toThrow('End date must be after start date');

    expect(
      mockOrderRepository.findByMerchantIdAndDateRangeAndStatus,
    ).not.toHaveBeenCalled();
    expect(mockDisbursementRepository.create).not.toHaveBeenCalled();
    expect(mockOrderRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when repository fails to find orders', async () => {
    const merchantId = 'merchant-123';
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    const error = new Error('Database error');

    mockOrderRepository.findByMerchantIdAndDateRangeAndStatus.mockRejectedValue(
      error,
    );

    await expect(
      useCase.execute({
        merchantId,
        startDate,
        endDate,
      }),
    ).rejects.toThrow(error);

    expect(mockDisbursementRepository.create).not.toHaveBeenCalled();
    expect(mockOrderRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when repository fails to create disbursement', async () => {
    const merchantId = 'merchant-123';
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    const pendingOrders = [createOrderMock({ merchantId, amount: 100 })];
    const error = new Error('Database error');

    mockOrderRepository.findByMerchantIdAndDateRangeAndStatus.mockResolvedValue(
      pendingOrders,
    );
    mockDisbursementRepository.create.mockRejectedValue(error);

    await expect(
      useCase.execute({
        merchantId,
        startDate,
        endDate,
      }),
    ).rejects.toThrow(error);

    expect(mockOrderRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when repository fails to update order', async () => {
    const merchantId = 'merchant-123';
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    const pendingOrders = [createOrderMock({ merchantId, amount: 100 })];
    const error = new Error('Database error');

    mockOrderRepository.findByMerchantIdAndDateRangeAndStatus.mockResolvedValue(
      pendingOrders,
    );
    mockDisbursementRepository.create.mockResolvedValue(
      createDisbursementMock({
        merchantId,
        totalAmount: 100,
      }),
    );
    mockOrderRepository.update.mockRejectedValue(error);

    await expect(
      useCase.execute({
        merchantId,
        startDate,
        endDate,
      }),
    ).rejects.toThrow(error);
  });
});
