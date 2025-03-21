import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoDisbursementRepository } from '@modules/disbursements/infrastructure/persistence/repositories';
import {
  DisbursementDocument,
  DisbursementModel,
} from '@modules/disbursements/infrastructure/persistence/schemas';
import { Disbursement } from '@modules/disbursements/domain/entities';

describe('MongoDisbursementRepository', () => {
  let repository: MongoDisbursementRepository;
  let mockModel: Model<DisbursementDocument>;

  const mockDisbursement = new Disbursement({
    merchantId: 'merchant-123',
    totalAmount: 1000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
  });

  const mockDisbursementDocument = {
    id: mockDisbursement.id,
    merchantId: mockDisbursement.merchantId,
    totalAmount: mockDisbursement.totalAmount.getValue(),
    fee: mockDisbursement.fee.getValue(),
    reference: mockDisbursement.reference.getValue(),
    startDate: mockDisbursement.startDate,
    endDate: mockDisbursement.endDate,
    createdAt: mockDisbursement.createdAt,
    updatedAt: mockDisbursement.createdAt,
    _id: 'mock-id',
    __v: 0,
  } as unknown as DisbursementDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoDisbursementRepository,
        {
          provide: getModelToken(DisbursementModel.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockDisbursementDocument),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MongoDisbursementRepository>(
      MongoDisbursementRepository,
    );
    mockModel = module.get<Model<DisbursementDocument>>(
      getModelToken(DisbursementModel.name),
    );
  });

  describe('create', () => {
    it('should create a disbursement', async () => {
      const result = await repository.create(mockDisbursement);

      expect(mockModel.create).toHaveBeenCalledWith({
        id: mockDisbursement.id,
        merchantId: mockDisbursement.merchantId,
        totalAmount: mockDisbursement.totalAmount.getValue(),
        fee: mockDisbursement.fee.getValue(),
        reference: mockDisbursement.reference.getValue(),
        startDate: mockDisbursement.startDate,
        endDate: mockDisbursement.endDate,
        createdAt: mockDisbursement.createdAt,
      });

      expect(result).toBeInstanceOf(Disbursement);
      expect(result.id).toBe(mockDisbursement.id);
      expect(result.merchantId).toBe(mockDisbursement.merchantId);
      expect(result.totalAmount.getValue()).toBe(
        mockDisbursement.totalAmount.getValue(),
      );
    });
  });

  describe('findByMerchantAndDate', () => {
    it('should find a disbursement by merchant and date', async () => {
      const date = new Date('2024-01-15');
      jest
        .spyOn(mockModel, 'findOne')
        .mockResolvedValue(mockDisbursementDocument);

      const result = await repository.findByMerchantAndDate(
        mockDisbursement.merchantId,
        date,
      );

      expect(mockModel.findOne).toHaveBeenCalledWith({
        merchantId: mockDisbursement.merchantId,
        startDate: { $lte: date },
        endDate: { $gte: date },
      });

      expect(result).toBeInstanceOf(Disbursement);
      expect(result?.id).toBe(mockDisbursement.id);
    });

    it('should return null when no disbursement is found', async () => {
      const date = new Date('2024-01-15');
      jest.spyOn(mockModel, 'findOne').mockResolvedValue(null);

      const result = await repository.findByMerchantAndDate(
        mockDisbursement.merchantId,
        date,
      );

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all disbursements', async () => {
      jest
        .spyOn(mockModel, 'find')
        .mockResolvedValue([mockDisbursementDocument]);

      const result = await repository.findAll();

      expect(mockModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Disbursement);
      expect(result[0].id).toBe(mockDisbursement.id);
    });

    it('should return empty array when no disbursements exist', async () => {
      jest.spyOn(mockModel, 'find').mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should find a disbursement by id', async () => {
      jest
        .spyOn(mockModel, 'findOne')
        .mockResolvedValue(mockDisbursementDocument);

      const result = await repository.findById(mockDisbursement.id);

      expect(mockModel.findOne).toHaveBeenCalledWith({
        id: mockDisbursement.id,
      });

      expect(result).toBeInstanceOf(Disbursement);
      expect(result?.id).toBe(mockDisbursement.id);
    });

    it('should return null when no disbursement is found', async () => {
      jest.spyOn(mockModel, 'findOne').mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
