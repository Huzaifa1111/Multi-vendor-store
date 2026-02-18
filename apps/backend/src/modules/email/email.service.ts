import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailConfig } from '../../config/email.config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    const config = emailConfig();
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  }

  async sendOtpEmail(to: string, name: string, otp: string) {
    const config = emailConfig();
    try {
      const info = await this.transporter.sendMail({
        from: config.smtpFrom,
        to,
        subject: 'Your OTP Code',
        html: `<p>Hi ${name},</p><p>Your OTP code is: <strong>${otp}</strong></p>`,
      });
      this.logger.log(`OTP sent to ${to}: ${info.messageId}`);
      return { sent: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${to}`, error.stack);
      return { sent: false, error };
    }
  }

  async sendOrderConfirmation(to: string, name: string, orderId: string, orderDetails: any) {
    const config = emailConfig();
    try {
      const info = await this.transporter.sendMail({
        from: config.smtpFrom,
        to,
        subject: `Order Confirmation #${orderId}`,
        html: `<p>Hi ${name},</p><p>Thank you for your order #${orderId}.</p><p>We will notify you when it ships.</p>`,
      });
      this.logger.log(`Order confirmation sent to ${to}: ${info.messageId}`);
      return { sent: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Failed to send order confirmation to ${to}`, error.stack);
      return { sent: false, error };
    }
  }
}