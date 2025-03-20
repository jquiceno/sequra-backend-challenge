import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderController } from '../../../infrastructure/controllers/create-order.controller';
import { CreateOrderUseCase } from '../../../application/use-cases';
import { CreateOrderDto } from '../../../application/dtos';
import { Order } from '../../../domain/entities';

describe('CreateOrderController', () => {
  let controller: CreateOrderController;
  let useCase: jest.Mocked<CreateOrderUseCase>;

  const mockCreateOrderDto: CreateOrderDto = {
    merchantId: 'merchant-123',
    amount: 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateOrderController],
      providers: [
        {
          provide: CreateOrderUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateOrderController>(CreateOrderController);
    useCase = module.get(CreateOrderUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('execute', () => {
    it('should create an order successfully', async () => {
      const expectedOrder = new Order({
        merchantId: mockCreateOrderDto.merchantId,
        amount: mockCreateOrderDto.amount,
      });

      useCase.execute.mockResolvedValue(expectedOrder);

      const result = await controller.execute(mockCreateOrderDto);

      expect(result).toBeInstanceOf(Order);
      expect(result.merchantId).toBe(mockCreateOrderDto.merchantId);
      expect(result.amount).toBe(mockCreateOrderDto.amount);
      expect(useCase.execute).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('should throw NotFoundException when merchant is not found', async () => {
      useCase.execute.mockRejectedValue(new Error('Merchant not found'));

      await expect(controller.execute(mockCreateOrderDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(useCase.execute).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('should throw BadRequestException for other errors', async () => {
      useCase.execute.mockRejectedValue(new Error('Invalid amount'));

      await expect(controller.execute(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(useCase.execute).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('should preserve error message in BadRequestException', async () => {
      const errorMessage = 'Amount must be greater than zero';
      useCase.execute.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.execute(mockCreateOrderDto);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(errorMessage);
      }
    });

    it('should preserve error message in NotFoundException', async () => {
      const errorMessage = 'Merchant not found';
      useCase.execute.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.execute(mockCreateOrderDto);
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});
