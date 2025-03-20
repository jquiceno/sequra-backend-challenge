import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../domain/entities';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderModel, OrderDocument } from '../persistence/schemas';
import { OrderStatus } from '../../domain/enums';

@Injectable()
export class MongoOrderRepository extends OrderRepository {
  constructor(
    @InjectModel(OrderModel.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {
    super();
  }

  async create(order: Order): Promise<Order> {
    const createdOrder = await this.orderModel.create({
      id: order.id,
      merchantId: order.merchantId,
      amount: order.amount,
      status: order.getStatus(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });

    return this.toEntity(createdOrder);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.orderModel.findOne({ id }).exec();
    return order ? this.toEntity(order) : null;
  }

  async findByMerchantId(merchantId: string): Promise<Order[]> {
    const orders = await this.orderModel.find({ merchantId }).exec();
    return orders.map((order) => this.toEntity(order));
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderModel.find().exec();
    return orders.map((order) => this.toEntity(order));
  }

  async update(order: Order): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findOneAndUpdate(
        { id: order.id },
        {
          status: order.getStatus(),
          updatedAt: order.updatedAt,
        },
        { new: true },
      )
      .exec();

    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    return this.toEntity(updatedOrder);
  }

  async findByMerchantIdAndDateRangeAndStatus(
    merchantId: string,
    startDate: Date,
    endDate: Date,
    status: OrderStatus,
  ): Promise<Order[]> {
    const orders = await this.orderModel
      .find({
        merchantId,
        status,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();

    return orders.map((order) => this.toEntity(order));
  }

  private toEntity(orderModel: OrderDocument): Order {
    return new Order({
      id: orderModel.id,
      merchantId: orderModel.merchantId,
      amount: orderModel.amount,
      status: orderModel.status,
      createdAt: orderModel.createdAt,
      updatedAt: orderModel.updatedAt,
    });
  }
}
