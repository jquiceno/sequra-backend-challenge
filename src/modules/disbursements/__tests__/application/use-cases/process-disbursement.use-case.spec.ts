import { OrderRepository } from '@modules/orders/domain/repositories';
import { DisbursementRepository } from '@modules/disbursements/domain/repositories';
import { ProcessDisbursementUseCase } from '@modules/disbursements/application/use-cases';
import { createOrderMock } from '@modules/orders/__tests__/__mocks__/order.mock';
import { OrderStatus } from '@modules/orders/domain/enums';
import { MerchantRepository } from '@modules/merchants/domain/repositories';
import { createMerchantMock } from '@modules/merchants/__tests__/__mocks__/merchant.mock';
import { DisbursementFrequency } from '@modules/merchants/domain/enums';
import { createDisbursementMock } from '../../__mocks__/disbursement.mock';
import { GetDateRangesByFrequencyStrategy } from '@modules/disbursements/domain/strategies/get-date-ranges-by-frequency.strategy';

describe('ProcessDisbursementUseCase', () => {
  let useCase: ProcessDisbursementUseCase;
  let mockOrderRepository: jest.Mocked<OrderRepository>;
  let mockDisbursementRepository: jest.Mocked<DisbursementRepository>;
  let mockMerchantRepository: jest.Mocked<MerchantRepository>;
  let dateRangesStrategy: jest.Mocked<GetDateRangesByFrequencyStrategy>;
  let dateRange: { startDate: Date; endDate: Date };

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

    mockMerchantRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findByDisbursementFrequency: jest.fn(),
    };

    dateRange = {
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-03-11'),
    };

    dateRangesStrategy = {
      execute: jest.fn().mockReturnValue(dateRange),
    } as any;

    useCase = new ProcessDisbursementUseCase(
      mockOrderRepository,
      mockDisbursementRepository,
      mockMerchantRepository,
      dateRangesStrategy,
    );
  });

  describe('Daily disbursements', () => {
    it('should process daily disbursements successfully', async () => {
      const merchant = createMerchantMock({
        disbursementFrequency: DisbursementFrequency.DAILY,
      });

      const pendingOrders = [
        createOrderMock({ merchantId: merchant.id, amount: 100 }),
        createOrderMock({ merchantId: merchant.id, amount: 200 }),
      ];

      mockMerchantRepository.findByDisbursementFrequency.mockResolvedValue([
        merchant,
      ]);
      mockOrderRepository.findByMerchantIdAndDateRangeAndStatus.mockResolvedValue(
        pendingOrders,
      );
      mockDisbursementRepository.create.mockImplementation((disbursement) =>
        Promise.resolve(disbursement),
      );
      mockOrderRepository.update.mockImplementation((order) =>
        Promise.resolve(order),
      );

      const result = await useCase.execute(DisbursementFrequency.DAILY);

      expect(result).toHaveLength(1);
      expect(
        mockMerchantRepository.findByDisbursementFrequency,
      ).toHaveBeenCalledWith(DisbursementFrequency.DAILY);
      expect(
        mockOrderRepository.findByMerchantIdAndDateRangeAndStatus,
      ).toHaveBeenCalledWith(
        merchant.id,
        expect.any(Date),
        expect.any(Date),
        OrderStatus.PENDING,
      );
      expect(mockDisbursementRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          merchantId: merchant.id,
          totalAmount: expect.objectContaining({
            value: 300,
          }),
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

    it('should skip merchants with no pending orders', async () => {
      const merchant = createMerchantMock({
        disbursementFrequency: DisbursementFrequency.DAILY,
      });

      mockMerchantRepository.findByDisbursementFrequency.mockResolvedValue([
        merchant,
      ]);
      mockOrderRepository.findByMerchantIdAndDateRangeAndStatus.mockResolvedValue(
        [],
      );

      const result = await useCase.execute(DisbursementFrequency.DAILY);

      expect(result).toHaveLength(0);
      expect(mockDisbursementRepository.create).not.toHaveBeenCalled();
      expect(mockOrderRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('Weekly disbursements', () => {
    it('should process weekly disbursements successfully', async () => {
      const merchant = createMerchantMock({
        disbursementFrequency: DisbursementFrequency.WEEKLY,
      });

      const pendingOrders = [
        createOrderMock({ merchantId: merchant.id, amount: 100 }),
        createOrderMock({ merchantId: merchant.id, amount: 200 }),
      ];

      mockMerchantRepository.findByDisbursementFrequency.mockResolvedValue([
        merchant,
      ]);
      mockOrderRepository.findByMerchantIdAndDateRangeAndStatus.mockResolvedValue(
        pendingOrders,
      );
      mockDisbursementRepository.create.mockImplementation((disbursement) =>
        Promise.resolve(disbursement),
      );
      mockOrderRepository.update.mockImplementation((order) =>
        Promise.resolve(order),
      );

      const result = await useCase.execute(DisbursementFrequency.WEEKLY);

      expect(result).toHaveLength(1);
      expect(
        mockMerchantRepository.findByDisbursementFrequency,
      ).toHaveBeenCalledWith(DisbursementFrequency.WEEKLY);
      expect(
        mockOrderRepository.findByMerchantIdAndDateRangeAndStatus,
      ).toHaveBeenCalledWith(
        merchant.id,
        expect.any(Date),
        expect.any(Date),
        OrderStatus.PENDING,
      );
      expect(mockDisbursementRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          merchantId: merchant.id,
          totalAmount: expect.objectContaining({
            value: 300,
          }),
        }),
      );
      expect(mockOrderRepository.update).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle repository errors gracefully', async () => {
    const error = new Error('Database error');
    mockMerchantRepository.findByDisbursementFrequency.mockRejectedValue(error);

    await expect(useCase.execute(DisbursementFrequency.DAILY)).rejects.toThrow(
      error,
    );
    expect(
      mockOrderRepository.findByMerchantIdAndDateRangeAndStatus,
    ).not.toHaveBeenCalled();
    expect(mockDisbursementRepository.create).not.toHaveBeenCalled();
    expect(mockOrderRepository.update).not.toHaveBeenCalled();
  });

  it('should process disbursements for merchants with pending orders', async () => {
    const merchant = createMerchantMock();
    const orders = [
      createOrderMock({ amount: 100 }),
      createOrderMock({ amount: 200 }),
    ];
    const disbursement = createDisbursementMock({
      merchantId: merchant.id,
      totalAmount: 300,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    mockMerchantRepository.findByDisbursementFrequency.mockResolvedValue([
      merchant,
    ]);
    mockOrderRepository.findByMerchantIdAndDateRangeAndStatus.mockResolvedValue(
      orders,
    );
    mockDisbursementRepository.create.mockResolvedValue(disbursement);
    mockOrderRepository.update.mockImplementation((order) =>
      Promise.resolve(order),
    );

    const result = await useCase.execute(DisbursementFrequency.DAILY);

    expect(
      mockMerchantRepository.findByDisbursementFrequency,
    ).toHaveBeenCalledWith(DisbursementFrequency.DAILY);
    expect(dateRangesStrategy.execute).toHaveBeenCalledWith(
      DisbursementFrequency.DAILY,
    );
    expect(
      mockOrderRepository.findByMerchantIdAndDateRangeAndStatus,
    ).toHaveBeenCalledWith(
      merchant.id,
      dateRange.startDate,
      dateRange.endDate,
      OrderStatus.PENDING,
    );

    const createCall = mockDisbursementRepository.create.mock.calls[0][0];
    expect(createCall).toBeDefined();
    expect(createCall.startDate).toEqual(dateRange.startDate);
    expect(createCall.endDate).toEqual(dateRange.endDate);

    expect(mockOrderRepository.update).toHaveBeenCalledTimes(2);
    expect(result).toEqual([disbursement]);
  });

  it('should skip merchants without pending orders', async () => {
    const merchant = createMerchantMock();

    mockMerchantRepository.findByDisbursementFrequency.mockResolvedValue([
      merchant,
    ]);
    mockOrderRepository.findByMerchantIdAndDateRangeAndStatus.mockResolvedValue(
      [],
    );

    const result = await useCase.execute(DisbursementFrequency.WEEKLY);

    expect(
      mockMerchantRepository.findByDisbursementFrequency,
    ).toHaveBeenCalledWith(DisbursementFrequency.WEEKLY);
    expect(dateRangesStrategy.execute).toHaveBeenCalledWith(
      DisbursementFrequency.WEEKLY,
    );
    expect(
      mockOrderRepository.findByMerchantIdAndDateRangeAndStatus,
    ).toHaveBeenCalledWith(
      merchant.id,
      dateRange.startDate,
      dateRange.endDate,
      OrderStatus.PENDING,
    );
    expect(mockDisbursementRepository.create).not.toHaveBeenCalled();
    expect(mockOrderRepository.update).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return empty array when no merchants found', async () => {
    mockMerchantRepository.findByDisbursementFrequency.mockResolvedValue([]);

    const result = await useCase.execute(DisbursementFrequency.DAILY);

    expect(
      mockMerchantRepository.findByDisbursementFrequency,
    ).toHaveBeenCalledWith(DisbursementFrequency.DAILY);
    expect(dateRangesStrategy.execute).toHaveBeenCalledWith(
      DisbursementFrequency.DAILY,
    );
    expect(
      mockOrderRepository.findByMerchantIdAndDateRangeAndStatus,
    ).not.toHaveBeenCalled();
    expect(mockDisbursementRepository.create).not.toHaveBeenCalled();
    expect(mockOrderRepository.update).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
