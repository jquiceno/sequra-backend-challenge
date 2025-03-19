import { GetAllMerchantsUseCase } from '../../application/use-cases/get-all-merchants.use-case';
import { MerchantRepository } from '../../domain/repositories';
import { Merchant } from '../../domain/entities';
import { DisbursementFrequency } from '../../domain/enums';

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
