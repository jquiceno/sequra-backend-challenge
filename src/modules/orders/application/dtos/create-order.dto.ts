import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
