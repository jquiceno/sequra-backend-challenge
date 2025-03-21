import { GetMerchantByIdUseCase } from '@modules/merchants/application/use-cases';
import { MerchantRepository } from '@modules/merchants/domain/repositories';
import { createMerchantMock } from '../../__mocks__/merchant.mock';

describe('GetMerchantByIdUseCase', () => {
  let useCase: GetMerchantByIdUseCase;
  let mockMerchantRepository: jest.Mocked<MerchantRepository>;

  beforeEach(() => {
    mockMerchantRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findByDisbursementFrequency: jest.fn(),
    };

    useCase = new GetMerchantByIdUseCase(mockMerchantRepository);
  });

  it('should return merchant when found', async () => {
    const merchantId = 'merchant-123';
    const expectedMerchant = createMerchantMock({ id: merchantId });

    mockMerchantRepository.findById.mockResolvedValue(expectedMerchant);

    const result = await useCase.execute(merchantId);

    expect(result).toEqual(expectedMerchant);
    expect(mockMerchantRepository.findById).toHaveBeenCalledWith(merchantId);
  });

  it('should return null when merchant not found', async () => {
    const merchantId = 'merchant-123';
    mockMerchantRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(merchantId);

    expect(result).toBeNull();
    expect(mockMerchantRepository.findById).toHaveBeenCalledWith(merchantId);
  });

  it('should throw error when repository fails', async () => {
    const merchantId = 'merchant-123';
    const error = new Error('Database error');
    mockMerchantRepository.findById.mockRejectedValue(error);

    await expect(useCase.execute(merchantId)).rejects.toThrow(error);
  });
});
