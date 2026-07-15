import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from '@shared/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';   // 👈 CHANGE 1: naya import

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly eventEmitter: EventEmitter2,          // 👈 CHANGE 2: constructor mein add
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
    const savedOrder = await this.orderRepository.save(order);

    this.eventEmitter.emit('order.created', { orderId: savedOrder.id });  // 👈 CHANGE 3

    return savedOrder;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findById(id);
    order.status = status;
    order.updatedAt = new Date();
    const updatedOrder = await this.orderRepository.save(order);

    this.eventEmitter.emit('order.updated', { orderId: updatedOrder.id });  // 👈 CHANGE 4

    return updatedOrder;
  }
}