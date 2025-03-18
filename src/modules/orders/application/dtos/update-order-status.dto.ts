import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '@modules/orders/domain/enums';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
