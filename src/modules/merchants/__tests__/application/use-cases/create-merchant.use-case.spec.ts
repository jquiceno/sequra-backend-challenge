import { CreateMerchantUseCase } from '@modules/merchants/application/use-cases';
import { MerchantRepository } from '@modules/merchants/domain/repositories';
import { createMerchantMock } from '../../__mocks__/merchant.mock';
import { DisbursementFrequency } from '@modules/merchants/domain/enums/disbursement-frequency.enum';

describe('CreateMerchantUseCase', () => {
  let useCase: CreateMerchantUseCase;
  let mockMerchantRepository: jest.Mocked<MerchantRepository>;

  beforeEach(() => {
    mockMerchantRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByReference: jest.fn(),
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
      liveOn: '2024-01-01',
    };

    const expectedMerchant = createMerchantMock({
      reference: createMerchantDto.reference,
      email: createMerchantDto.email,
      disbursementFrequency: createMerchantDto.disbursementFrequency,
      minimumMonthlyFee: createMerchantDto.minimumMonthlyFee,
      liveOn: new Date(createMerchantDto.liveOn),
    });

    mockMerchantRepository.create.mockResolvedValue(expectedMerchant);

    const result = await useCase.execute(createMerchantDto);

    expect(result).toEqual(expectedMerchant);
    expect(mockMerchantRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        reference: createMerchantDto.reference,
        email: createMerchantDto.email,
        disbursementFrequency: createMerchantDto.disbursementFrequency,
        minimumMonthlyFee: createMerchantDto.minimumMonthlyFee,
        liveOn: new Date(createMerchantDto.liveOn),
      }),
    );
  });

  it('should create a merchant without liveOn date', async (): Promise<void> => {
    const createMerchantDto = {
      reference: 'merchant-123',
      email: 'test@example.com',
      disbursementFrequency: DisbursementFrequency.WEEKLY,
      minimumMonthlyFee: 100,
    };

    const expectedMerchant = createMerchantMock({
      reference: createMerchantDto.reference,
      email: createMerchantDto.email,
      disbursementFrequency: createMerchantDto.disbursementFrequency,
      minimumMonthlyFee: createMerchantDto.minimumMonthlyFee,
    });

    mockMerchantRepository.create.mockResolvedValue(expectedMerchant);

    const result = await useCase.execute(createMerchantDto);

    expect(result).toEqual(expectedMerchant);
    expect(mockMerchantRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        reference: createMerchantDto.reference,
        email: createMerchantDto.email,
        disbursementFrequency: createMerchantDto.disbursementFrequency,
        minimumMonthlyFee: createMerchantDto.minimumMonthlyFee,
      }),
    );
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
  });
});
