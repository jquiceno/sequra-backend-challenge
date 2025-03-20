import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases';
import { CreateOrderDto } from '../../application/dtos';
import { Order } from '../../domain/entities';

@Controller('orders')
export class CreateOrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  async execute(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const order = await this.createOrderUseCase.execute(createOrderDto);
      return order;
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException(error.message);
    }
  }
}
