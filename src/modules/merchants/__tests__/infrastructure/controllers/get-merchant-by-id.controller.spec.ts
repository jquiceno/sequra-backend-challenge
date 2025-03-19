import { Test, TestingModule } from '@nestjs/testing';
import { GetMerchantByIdController } from '../../../infrastructure/controllers/get-merchant-by-id.controller';
import { GetMerchantByIdUseCase } from '../../../application/use-cases/get-merchant-by-id.use-case';
import { createMerchantMock } from '../../__mocks__/merchant.mock';

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
      const expectedMerchant = createMerchantMock({ id: merchantId });

      useCase.execute.mockResolvedValue(expectedMerchant);

      const result = await controller.execute(merchantId);

      expect(result).toEqual(expectedMerchant);
      expect(useCase.execute).toHaveBeenCalledWith(merchantId);
    });

    it('should return null when merchant not found', async () => {
      const merchantId = 'merchant-123';
      useCase.execute.mockResolvedValue(null);

      const result = await controller.execute(merchantId);

      expect(result).toBeNull();
      expect(useCase.execute).toHaveBeenCalledWith(merchantId);
    });
  });
});
