import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { DisbursementFrequency } from '../../domain/enums';

export class CreateMerchantDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(DisbursementFrequency)
  disbursementFrequency: DisbursementFrequency;

  @IsNumber()
  @IsPositive()
  minimumMonthlyFee: number;

  @IsString()
  @IsOptional()
  liveOn?: string;
}
