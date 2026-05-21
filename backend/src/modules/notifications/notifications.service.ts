import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailService } from './email/email.service';
import { PushService } from './push/push.service';

/**
 * Notifications Service
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly eventEmitter: EventEmitter2,
    private readonly emailService: EmailService,
    private readonly pushService: PushService,
  ) {}

  /**
   * Create notification
   */
  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      link?: string;
      image?: string;
      data?: Record<string, any>;
      sendEmail?: boolean;
      sendPush?: boolean;
    },
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type,
      title,
      message,
      link: options?.link,
      image: options?.image,
      data: options?.data,
    });

    const saved = await this.notificationRepository.save(notification);

    // Emit event for real-time updates
    this.eventEmitter.emit('notification.created', saved);

    // Send email if requested
    if (options?.sendEmail) {
      await this.emailService.sendNotificationEmail(userId, saved);
      saved.isEmailSent = true;
    }

    // Send push notification if requested
    if (options?.sendPush) {
      await this.pushService.sendPushNotification(userId, saved);
      saved.isPushSent = true;
    }

    if (options?.sendEmail || options?.sendPush) {
      await this.notificationRepository.save(saved);
    }

    this.logger.log(`Notification created for user ${userId}: ${title}`);
    return saved;
  }

  /**
   * Get user notifications
   */
  async listForUser(userId: string, page = 1, limit = 20, unreadOnly = false) {
    const where: any = { userId, isActive: true };

    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total] =
      await this.notificationRepository.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

    const unreadCount = await this.getUnreadCount(userId);

    return {
      notifications,
      unreadCount,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    };
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false, isActive: true },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { isRead: true, readAt: new Date() },
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  /**
   * Delete notification
   */
  async delete(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { isActive: false },
    );
  }

  /**
   * Send price drop notification
   */
  async notifyPriceDrop(
    userId: string,
    productTitle: string,
    oldPrice: number,
    newPrice: number,
    productId: string,
  ) {
    const savings = oldPrice - newPrice;
    const percentage = Math.round((savings / oldPrice) * 100);

    return this.create(
      userId,
      'PRICE_DROP',
      '💰 Price Drop Alert!',
      `${productTitle} is now $${newPrice.toFixed(2)} (${percentage}% off)! Save $${savings.toFixed(2)}.`,
      {
        link: `/product/${productId}`,
        data: { productId, oldPrice, newPrice, savings },
        sendEmail: true,
        sendPush: true,
      },
    );
  }

  /**
   * Send back in stock notification
   */
  async notifyBackInStock(
    userId: string,
    productTitle: string,
    productId: string,
  ) {
    return this.create(
      userId,
      'BACK_IN_STOCK',
      '📦 Back in Stock!',
      `${productTitle} is now available. Order before it sells out again!`,
      {
        link: `/product/${productId}`,
        data: { productId },
        sendEmail: true,
        sendPush: true,
      },
    );
  }

  /**
   * Send order update notification
   */
  async notifyOrderUpdate(
    userId: string,
    orderNumber: string,
    status: string,
    orderId: string,
  ) {
    const statusMessages: Record<string, string> = {
      CONFIRMED: '✅ Your order has been confirmed',
      SHIPPED: '🚚 Your order has been shipped',
      OUT_FOR_DELIVERY: '📬 Your order is out for delivery',
      DELIVERED: '📦 Your order has been delivered',
    };

    return this.create(
      userId,
      'ORDER_UPDATE',
      'Order Update',
      statusMessages[status] || `Your order #${orderNumber} status: ${status}`,
      {
        link: `/orders/${orderId}`,
        data: { orderId, orderNumber, status },
        sendEmail: true,
      },
    );
  }
}
