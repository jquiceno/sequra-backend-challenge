import {
  IsString,
  IsNumber,
  IsDate,
  IsNotEmpty,
  validateSync,
} from 'class-validator';
import { Amount, Fee } from '../value-objects';

export class Disbursement {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly merchantId: string;

  @IsNumber()
  readonly totalAmount: number;

  @IsNumber()
  readonly fee: number;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    merchantId: string;
    totalAmount: number;
    fee: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const totalAmount = new Amount(props.totalAmount);
    const fee = new Fee(props.fee, totalAmount);

    Object.assign(this, {
      ...props,
      totalAmount: totalAmount.getValue(),
      fee: fee.getValue(),
    });

    const errors = validateSync(this);
    if (errors.length) {
      throw new Error(
        `Validation failed: ${JSON.stringify(errors.join(', '))}`,
      );
    }
  }
}
