import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { DisbursementFrequency } from '../../domain/enums';

export class CreateMerchantDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(DisbursementFrequency)
  disbursementFrequency: DisbursementFrequency;

  @IsNumber()
  @IsPositive()
  minimumMonthlyFee: number;
}
