import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DisbursementFrequency } from '../../../domain/enums';

@Schema({ collection: 'merchants' })
export class MerchantDocument {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, unique: true })
  reference: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  liveOn: Date;

  @Prop({ required: true, enum: DisbursementFrequency })
  disbursementFrequency: DisbursementFrequency;

  @Prop({ required: true })
  minimumMonthlyFee: number;
}

export const MerchantSchema = SchemaFactory.createForClass(MerchantDocument);
