import { CreateMerchantUseCase } from '@modules/merchants/application/use-cases';
import { MerchantRepository } from '@modules/merchants/domain/repositories';
import { DisbursementFrequency } from '@modules/merchants/domain/enums/disbursement-frequency.enum';
import { Merchant } from '@modules/merchants/domain/entities';

describe('CreateMerchantUseCase', () => {
  let useCase: CreateMerchantUseCase;
  let mockMerchantRepository: jest.Mocked<MerchantRepository>;

  beforeEach(() => {
    mockMerchantRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new CreateMerchantUseCase(mockMerchantRepository);
  });

  it('should create a merchant successfully', async (): Promise<void> => {
    const createMerchantDto = {
      reference: 'merchant-123',
      email: 'test@example.com',
      disbursementFrequency: DisbursementFrequency.WEEKLY,
      minimumMonthlyFee: 100,
    };

    const expectedMerchant = new Merchant({
      email: createMerchantDto.email,
      disbursementFrequency: createMerchantDto.disbursementFrequency,
      minimumMonthlyFee: createMerchantDto.minimumMonthlyFee,
      liveOn: new Date(),
    });

    mockMerchantRepository.create.mockResolvedValue(expectedMerchant);

    const result = await useCase.execute(createMerchantDto);

    expect(result).toBeDefined();
    expect(result.getEmail()).toBe(createMerchantDto.email);
    expect(result.disbursementFrequency).toBe(
      createMerchantDto.disbursementFrequency,
    );
    expect(result.minimumMonthlyFee).toBe(createMerchantDto.minimumMonthlyFee);
    expect(mockMerchantRepository.create).toHaveBeenCalledWith(
      expect.any(Merchant),
    );
    expect(mockMerchantRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw error when repository fails', async (): Promise<void> => {
    const createMerchantDto = {
      reference: 'merchant-123',
      email: 'test@example.com',
      disbursementFrequency: DisbursementFrequency.WEEKLY,
      minimumMonthlyFee: 100,
    };

    const error = new Error('Database error');
    mockMerchantRepository.create.mockRejectedValue(error);

    await expect(useCase.execute(createMerchantDto)).rejects.toThrow(error);
    expect(mockMerchantRepository.create).toHaveBeenCalledTimes(1);
  });

  describe('validation', () => {
    it('should throw error when email is invalid', async (): Promise<void> => {
      const createMerchantDto = {
        reference: 'merchant-123',
        email: 'invalid-email',
        disbursementFrequency: DisbursementFrequency.WEEKLY,
        minimumMonthlyFee: 100,
      };

      await expect(useCase.execute(createMerchantDto)).rejects.toThrow();
    });

    it('should throw error when minimum monthly fee is missing', async (): Promise<void> => {
      const createMerchantDto = {
        reference: 'merchant-123',
        email: 'test@example.com',
        disbursementFrequency: DisbursementFrequency.WEEKLY,
      } as any;

      await expect(useCase.execute(createMerchantDto)).rejects.toThrow(
        'Minimum monthly fee is required',
      );
    });

    it('should throw error when disbursement frequency is invalid', async (): Promise<void> => {
      const createMerchantDto = {
        reference: 'merchant-123',
        email: 'test@example.com',
        disbursementFrequency: 'INVALID' as DisbursementFrequency,
        minimumMonthlyFee: 100,
      };

      await expect(useCase.execute(createMerchantDto)).rejects.toThrow(
        'Invalid disbursement frequency',
      );
    });
  });
});
