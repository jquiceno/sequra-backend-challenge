import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderStatus } from '../../../domain/enums';

export type OrderDocument = HydratedDocument<OrderModel>;

@Schema({ collection: 'orders' })
export class OrderModel {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, ref: 'merchants.id' })
  merchantId: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({
    required: true,
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderModel);
