import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoOrderRepository } from '@modules/orders/infrastructure/repositories';
import {
  OrderModel,
  OrderDocument,
} from '@modules/orders/infrastructure/persistence/schemas';
import { Order } from '@modules/orders/domain/entities';
import { OrderStatus } from '@modules/orders/domain/enums';

describe('MongoOrderRepository', () => {
  let repository: MongoOrderRepository;
  let orderModel: Model<OrderDocument>;

  const mockOrder = new Order({
    merchantId: 'merchant-123',
    amount: 100,
    status: OrderStatus.PENDING,
  });

  const mockOrderModel = {
    id: mockOrder.id,
    merchantId: mockOrder.merchantId,
    amount: mockOrder.amount,
    status: mockOrder.getStatus(),
    createdAt: mockOrder.createdAt,
    updatedAt: mockOrder.updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoOrderRepository,
        {
          provide: getModelToken(OrderModel.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MongoOrderRepository>(MongoOrderRepository);
    orderModel = module.get<Model<OrderDocument>>(
      getModelToken(OrderModel.name),
    );
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      jest.spyOn(orderModel, 'create').mockResolvedValue(mockOrderModel as any);

      const result = await repository.create(mockOrder);

      expect(result).toBeInstanceOf(Order);
      expect(result.id).toBe(mockOrder.id);
      expect(result.merchantId).toBe(mockOrder.merchantId);
      expect(result.amount).toBe(mockOrder.amount);
      expect(result.getStatus()).toBe(mockOrder.getStatus());
      expect(orderModel.create).toHaveBeenCalledWith(mockOrderModel);
    });
  });

  describe('findById', () => {
    it('should find an order by id', async () => {
      jest.spyOn(orderModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrderModel),
      } as any);

      const result = await repository.findById(mockOrder.id);

      expect(result).toBeInstanceOf(Order);
      expect(result?.id).toBe(mockOrder.id);
      expect(orderModel.findOne).toHaveBeenCalledWith({ id: mockOrder.id });
    });

    it('should return null if order is not found', async () => {
      jest
        .spyOn(orderModel, 'findOne')
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByMerchantId', () => {
    it('should find orders by merchant id', async () => {
      jest.spyOn(orderModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockOrderModel]),
      } as any);

      const result = await repository.findByMerchantId(mockOrder.merchantId);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Order);
      expect(result[0].merchantId).toBe(mockOrder.merchantId);
      expect(orderModel.find).toHaveBeenCalledWith({
        merchantId: mockOrder.merchantId,
      });
    });
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      const updatedOrder = mockOrder.updateStatus(OrderStatus.DISBURSED);

      jest.spyOn(orderModel, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockOrderModel,
          status: OrderStatus.DISBURSED,
          updatedAt: updatedOrder.updatedAt,
        }),
      } as any);

      const result = await repository.update(updatedOrder);

      expect(result).toBeInstanceOf(Order);
      expect(result.getStatus()).toBe(OrderStatus.DISBURSED);
      expect(orderModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: updatedOrder.id },
        {
          status: OrderStatus.DISBURSED,
          updatedAt: updatedOrder.updatedAt,
        },
        { new: true },
      );
    });

    it('should throw error if order not found during update', async () => {
      jest
        .spyOn(orderModel, 'findOneAndUpdate')
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);

      await expect(repository.update(mockOrder)).rejects.toThrow(
        'Order not found',
      );
    });
  });

  describe('findByMerchantIdAndDateRangeAndStatus', () => {
    it('should find orders by merchant id, date range and status', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const status = OrderStatus.PENDING;

      jest.spyOn(orderModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockOrderModel]),
      } as any);

      const result = await repository.findByMerchantIdAndDateRangeAndStatus(
        mockOrder.merchantId,
        startDate,
        endDate,
        status,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Order);
      expect(orderModel.find).toHaveBeenCalledWith({
        merchantId: mockOrder.merchantId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        status,
      });
    });
  });
});
