import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  async sendPushNotification(
    userId: string,
    notification: Notification,
  ): Promise<void> {
    // Stub for push notification service (e.g., Firebase Cloud Messaging)
    this.logger.log(
      `Push notification sent to user ${userId}: ${notification.title}`,
    );
  }
}
