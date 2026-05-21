import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Email Service
 * Handles transactional and marketing emails
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('SMTP_HOST', 'smtp.gmail.com'),
      port: configService.get('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: configService.get('SMTP_USER'),
        pass: configService.get('SMTP_PASS'),
      },
    });
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(
    userId: string,
    notification: any,
  ): Promise<void> {
    // TODO: Get user email from database
    const userEmail = 'user@example.com';

    const emailTemplate = this.getNotificationTemplate(notification);

    try {
      await this.transporter.sendMail({
        from: '"Amazon Clone" <notifications@amazonclone.com>',
        to: userEmail,
        subject: notification.title,
        html: emailTemplate,
      });

      this.logger.log(`Notification email sent to user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #232F3E; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: white; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { 
            display: inline-block; padding: 12px 30px; background: #FF9900;
            color: white; text-decoration: none; border-radius: 25px;
            font-weight: bold; margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Amazon Clone! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Thank you for creating an account with Amazon Clone. We're excited to have you on board!</p>
            <p>With your new account, you can:</p>
            <ul>
              <li>🛒 Shop millions of products</li>
              <li>🚚 Get fast, free shipping on eligible orders</li>
              <li>💝 Save items to your wishlist</li>
              <li>⭐ Write reviews and share your opinions</li>
            </ul>
            <a href="${this.configService.get('FRONTEND_URL')}/products" class="button">
              Start Shopping
            </a>
            <p>Need help? Our customer service team is available 24/7.</p>
          </div>
          <div class="footer">
            <p>© 2024 Amazon Clone. All rights reserved.</p>
            <p>This is a demo email from the Amazon Clone project.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: '"Amazon Clone" <welcome@amazonclone.com>',
      to: email,
      subject: 'Welcome to Amazon Clone! 🎉',
      html,
    });
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(email: string, order: any): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: #232F3E; color: white; padding: 20px; }
          .order-details { margin: 20px 0; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Order Confirmed! 📦</h2>
            <p>Order #${order.orderNumber}</p>
          </div>
          <div style="padding: 20px;">
            <p>Thank you for your order! Here's what you'll receive:</p>
            <div class="order-details">
              ${order.items
                .map(
                  (item: any) => `
                <div class="item">
                  <strong>${item.title}</strong>
                  <p>Qty: ${item.quantity} - $${item.totalPrice.toFixed(2)}</p>
                </div>
              `,
                )
                .join('')}
            </div>
            <div class="total">
              Total: $${order.total.toFixed(2)}
            </div>
            <p>Estimated delivery: ${order.estimatedDelivery}</p>
            <a href="${this.configService.get('FRONTEND_URL')}/orders/${order.id}" 
               style="display: inline-block; padding: 12px 30px; background: #FF9900; color: white; text-decoration: none; border-radius: 25px;">
              Track Your Order
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: '"Amazon Clone" <orders@amazonclone.com>',
      to: email,
      subject: `Order Confirmed - #${order.orderNumber}`,
      html,
    });
  }

  /**
   * Get notification email template
   */
  private getNotificationTemplate(notification: any): string {
    const iconMap: Record<string, string> = {
      PRICE_DROP: '💰',
      BACK_IN_STOCK: '📦',
      ORDER_UPDATE: '🚚',
      DEAL_ALERT: '🔥',
      SHIPPING_UPDATE: '📬',
      PROMOTIONAL: '🎉',
    };

    const icon = iconMap[notification.type] || '🔔';

    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #232F3E; padding: 20px; text-align: center;">
          <span style="font-size: 40px;">${icon}</span>
        </div>
        <div style="padding: 30px; background: white;">
          <h2>${notification.title}</h2>
          <p style="color: #666; font-size: 16px;">${notification.message}</p>
          ${
            notification.link
              ? `
            <a href="${notification.link}" 
               style="display: inline-block; padding: 12px 30px; background: #FF9900; color: white; text-decoration: none; border-radius: 25px; margin-top: 20px;">
              View Details
            </a>
          `
              : ''
          }
        </div>
      </body>
      </html>
    `;
  }
}
