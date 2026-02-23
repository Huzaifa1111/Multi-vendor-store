import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<number>('SMTP_PORT') === 465, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });

    // Verify connection on startup
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('SMTP Connection Error:', error);
      } else {
        this.logger.log('SMTP Server is ready to take messages');
      }
    });
  }

  async sendOtpEmail(to: string, name: string, otp: string) {
    const from = this.configService.get<string>('SMTP_FROM');
    try {
      const info = await this.transporter.sendMail({
        from,
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
    const from = this.configService.get<string>('SMTP_FROM');
    try {
      const info = await this.transporter.sendMail({
        from,
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