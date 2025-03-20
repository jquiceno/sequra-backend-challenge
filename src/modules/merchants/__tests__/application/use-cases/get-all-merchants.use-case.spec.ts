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
      findByEmail: jest.fn(),
    };

    useCase = new GetAllMerchantsUseCase(mockMerchantRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all merchants successfully', async () => {
      const mockMerchants: Merchant[] = [
        new Merchant({
          email: 'test1@example.com',
          liveOn: new Date(),
          disbursementFrequency: DisbursementFrequency.DAILY,
          minimumMonthlyFee: 100,
        }),
        new Merchant({
          email: 'test2@example.com',
          liveOn: new Date(),
          disbursementFrequency: DisbursementFrequency.WEEKLY,
          minimumMonthlyFee: 200,
        }),
      ];

      mockMerchantRepository.findAll.mockResolvedValue(mockMerchants);

      const result = await useCase.execute();

      expect(result).toEqual(mockMerchants);
      expect(mockMerchantRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no merchants exist', async () => {
      mockMerchantRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(mockMerchantRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository fails', async () => {
      const error = new Error('Database connection failed');
      mockMerchantRepository.findAll.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockMerchantRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
