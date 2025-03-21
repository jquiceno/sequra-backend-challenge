import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DisbursementDocument = DisbursementModel & Document;

@Schema({ collection: 'disbursements' })
export class DisbursementModel {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  merchantId: string;

  @Prop({ required: true, type: Number })
  totalAmount: number;

  @Prop({ required: true, type: Number })
  fee: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const DisbursementSchema =
  SchemaFactory.createForClass(DisbursementModel);
