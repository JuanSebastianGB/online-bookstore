import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prismService: PrismaService) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = await this.prismService.order.create({
      data: {
        ...createOrderDto,
      },
    });

    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.prismService.order.findMany();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.prismService.order.findUnique({ where: { id } });
    if (!order) throw new Error('Order not found');
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    return this.prismService.order.update({
      where: { id },
      data: { ...order, ...updateOrderDto },
    });
  }

  async remove(id: number): Promise<Order> {
    try {
      await this.findOne(id);
      return this.prismService.order.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
