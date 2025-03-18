import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class GetOrdersByDateRangeDto {
  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
