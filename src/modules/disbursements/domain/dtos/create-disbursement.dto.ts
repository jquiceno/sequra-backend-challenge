import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateDisbursementDto {
  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNumber()
  @IsPositive()
  fee: number;
}
