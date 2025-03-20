import { CreateOrderUseCase } from '../../../application/use-cases';
import { OrderRepository } from '../../../domain/repositories';
import { MerchantRepository } from '@modules/merchants/domain/repositories';
import { CreateOrderDto } from '../../../application/dtos';
import { Order } from '../../../domain/entities';
import { Merchant } from '@modules/merchants/domain/entities';
import { DisbursementFrequency } from '@modules/merchants/domain/enums';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;
  let merchantRepository: jest.Mocked<MerchantRepository>;

  const mockMerchant = new Merchant({
    email: 'test@example.com',
    disbursementFrequency: DisbursementFrequency.WEEKLY,
    minimumMonthlyFee: 100,
    liveOn: new Date(),
  });

  const mockCreateOrderDto: CreateOrderDto = {
    merchantId: mockMerchant.id,
    amount: 100,
  };

  beforeEach(() => {
    orderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByMerchantId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      findByMerchantIdAndDateRangeAndStatus: jest.fn(),
    };

    merchantRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new CreateOrderUseCase(orderRepository, merchantRepository);
  });

  describe('execute', () => {
    it('should create an order successfully', async () => {
      const expectedOrder = new Order({
        merchantId: mockCreateOrderDto.merchantId,
        amount: mockCreateOrderDto.amount,
      });

      merchantRepository.findById.mockResolvedValue(mockMerchant);
      orderRepository.create.mockResolvedValue(expectedOrder);

      const result = await useCase.execute(mockCreateOrderDto);

      expect(result).toBeInstanceOf(Order);
      expect(result.merchantId).toBe(mockCreateOrderDto.merchantId);
      expect(result.amount).toBe(mockCreateOrderDto.amount);
      expect(merchantRepository.findById).toHaveBeenCalledWith(
        mockCreateOrderDto.merchantId,
      );
      expect(orderRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          merchantId: mockCreateOrderDto.merchantId,
          amount: mockCreateOrderDto.amount,
        }),
      );
    });

    it('should throw error if merchant is not found', async () => {
      merchantRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(mockCreateOrderDto)).rejects.toThrow(
        'Merchant not found',
      );

      expect(merchantRepository.findById).toHaveBeenCalledWith(
        mockCreateOrderDto.merchantId,
      );
      expect(orderRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error if order creation fails', async () => {
      const error = new Error('Failed to create order');

      merchantRepository.findById.mockResolvedValue(mockMerchant);
      orderRepository.create.mockRejectedValue(error);

      await expect(useCase.execute(mockCreateOrderDto)).rejects.toThrow(error);

      expect(merchantRepository.findById).toHaveBeenCalledWith(
        mockCreateOrderDto.merchantId,
      );
      expect(orderRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          merchantId: mockCreateOrderDto.merchantId,
          amount: mockCreateOrderDto.amount,
        }),
      );
    });

    it('should throw error when creating order with invalid data', async () => {
      const invalidDto = {
        ...mockCreateOrderDto,
        amount: 0,
      };

      merchantRepository.findById.mockResolvedValue(mockMerchant);

      await expect(useCase.execute(invalidDto)).rejects.toThrow();

      expect(merchantRepository.findById).toHaveBeenCalledWith(
        mockCreateOrderDto.merchantId,
      );
      expect(orderRepository.create).not.toHaveBeenCalled();
    });
  });
});
