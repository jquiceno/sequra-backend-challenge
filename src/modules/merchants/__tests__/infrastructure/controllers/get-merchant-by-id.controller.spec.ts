import { Test, TestingModule } from '@nestjs/testing';
import { GetMerchantByIdController } from '../../../infrastructure/controllers/get-merchant-by-id.controller';
import { GetMerchantByIdUseCase } from '../../../application/use-cases/get-merchant-by-id.use-case';
import { createMerchantMock } from '../../__mocks__/merchant.mock';
import { NotFoundException } from '@nestjs/common';

describe('GetMerchantByIdController', () => {
  let controller: GetMerchantByIdController;
  let useCase: jest.Mocked<GetMerchantByIdUseCase>;

  beforeEach(async () => {
    useCase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetMerchantByIdController],
      providers: [
        {
          provide: GetMerchantByIdUseCase,
          useValue: useCase,
        },
      ],
    }).compile();

    controller = module.get<GetMerchantByIdController>(
      GetMerchantByIdController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('execute', () => {
    it('should return merchant when found', async () => {
      const merchantId = 'merchant-123';
      const expectedMerchant = createMerchantMock({
        id: merchantId,
        email: 'test@example.com',
        liveOn: new Date('2024-01-01'),
        minimumMonthlyFee: 100,
      });

      useCase.execute.mockResolvedValue(expectedMerchant);

      const result = await controller.execute(merchantId);

      expect(result).toEqual(expectedMerchant);
      expect(useCase.execute).toHaveBeenCalledWith(merchantId);
      expect(useCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when merchant not found', async () => {
      const merchantId = 'non-existent-id';
      useCase.execute.mockResolvedValue(null);

      await expect(controller.execute(merchantId)).rejects.toThrow(
        NotFoundException,
      );
      expect(useCase.execute).toHaveBeenCalledWith(merchantId);
      expect(useCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw error when useCase throws an error', async () => {
      const merchantId = 'merchant-123';
      const error = new Error('Database error');
      useCase.execute.mockRejectedValue(error);

      await expect(controller.execute(merchantId)).rejects.toThrow(error);
      expect(useCase.execute).toHaveBeenCalledWith(merchantId);
      expect(useCase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
