import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from '@shared/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async create(userId: string, orderData: Partial<Order>) {
    const order = this.orderRepository.create({
      ...orderData,
      userId,
      status: OrderStatus.PENDING,
    });
    return this.orderRepository.save(order);
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findById(id);
    order.status = status;
    order.updatedAt = new Date();
    return this.orderRepository.save(order);
  }
}
