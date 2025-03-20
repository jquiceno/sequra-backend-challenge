import { Test, TestingModule } from '@nestjs/testing';
import { CreateMerchantController } from '../../../infrastructure/controllers/create-merchant.controller';
import { CreateMerchantUseCase } from '../../../application/use-cases/create-merchant.use-case';
import { createMerchantMock } from '../../__mocks__/merchant.mock';
import { DisbursementFrequency } from '../../../domain/enums';

describe('CreateMerchantController', () => {
  let controller: CreateMerchantController;
  let useCase: jest.Mocked<CreateMerchantUseCase>;

  beforeEach(async () => {
    useCase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateMerchantController],
      providers: [
        {
          provide: CreateMerchantUseCase,
          useValue: useCase,
        },
      ],
    }).compile();

    controller = module.get<CreateMerchantController>(CreateMerchantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('execute', () => {
    it('should create a merchant successfully', async () => {
      const createMerchantDto = {
        reference: 'merchant-123',
        email: 'test@example.com',
        disbursementFrequency: DisbursementFrequency.WEEKLY,
        minimumMonthlyFee: 100,
        liveOn: '2024-01-01',
      };

      const expectedMerchant = createMerchantMock({
        email: createMerchantDto.email,
        disbursementFrequency: createMerchantDto.disbursementFrequency,
        minimumMonthlyFee: createMerchantDto.minimumMonthlyFee,
        liveOn: new Date(createMerchantDto.liveOn),
      });

      useCase.execute.mockResolvedValue(expectedMerchant);

      const result = await controller.execute(createMerchantDto);

      expect(result).toEqual(expectedMerchant);
      expect(useCase.execute).toHaveBeenCalledWith(createMerchantDto);
    });

    it('should create a merchant without liveOn date', async () => {
      const createMerchantDto = {
        reference: 'merchant-123',
        email: 'test@example.com',
        disbursementFrequency: DisbursementFrequency.WEEKLY,
        minimumMonthlyFee: 100,
      };

      const expectedMerchant = createMerchantMock({
        email: createMerchantDto.email,
        disbursementFrequency: createMerchantDto.disbursementFrequency,
        minimumMonthlyFee: createMerchantDto.minimumMonthlyFee,
      });

      useCase.execute.mockResolvedValue(expectedMerchant);

      const result = await controller.execute(createMerchantDto);

      expect(result).toEqual(expectedMerchant);
      expect(useCase.execute).toHaveBeenCalledWith(createMerchantDto);
    });
  });
});
