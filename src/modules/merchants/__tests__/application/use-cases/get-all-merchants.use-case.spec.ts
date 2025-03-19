import { GetAllMerchantsUseCase } from '@modules/merchants/application/use-cases';
import { MerchantRepository } from '@modules/merchants/domain/repositories';
import { Merchant } from '@modules/merchants/domain/entities';
import { DisbursementFrequency } from '@modules/merchants/domain/enums';

describe('GetAllMerchantsUseCase', () => {
  let useCase: GetAllMerchantsUseCase;
  let mockMerchantRepository: jest.Mocked<MerchantRepository>;

  beforeEach(() => {
    mockMerchantRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByReference: jest.fn(),
      findByEmail: jest.fn(),
    };

    useCase = new GetAllMerchantsUseCase(mockMerchantRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all merchants', async () => {
      const mockMerchants: Merchant[] = [
        new Merchant({
          reference: 'REF001',
          email: 'test1@example.com',
          liveOn: new Date(),
          disbursementFrequency: DisbursementFrequency.DAILY,
          minimumMonthlyFee: 100,
        }),
        new Merchant({
          reference: 'REF002',
          email: 'test2@example.com',
          liveOn: new Date(),
          disbursementFrequency: DisbursementFrequency.WEEKLY,
          minimumMonthlyFee: 200,
        }),
      ];

      mockMerchantRepository.findAll.mockResolvedValue(mockMerchants);

      const result = await useCase.execute();

      expect(result).toEqual(mockMerchants);
      expect(mockMerchantRepository.findAll).toHaveBeenCalled();
    });
  });
});
