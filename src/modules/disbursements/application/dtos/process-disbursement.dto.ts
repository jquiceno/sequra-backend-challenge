import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class ProcessDisbursementDto {
  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;
}
