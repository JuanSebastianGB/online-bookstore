import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prismService: PrismaService) {}
  async create(createOrderDto: CreateOrderDto) {
    return;
  }

  async findAll(): Promise<Order[]> {
    return this.prismService.order.findMany();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.prismService.order.findUnique({ where: { id } });
    if (!order) throw new Error('Order not found');
    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
