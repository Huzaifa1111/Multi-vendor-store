// apps/backend/src/modules/email/email.service.ts - NEW FILE
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not found. Email service will not work.');
    } else {
      this.resend = new Resend(apiKey);
    }
  }

  generateOtp(): string {
    // Generate 6-digit OTP
    return crypto.randomInt(100000, 999999).toString();
  }

  calculateOtpExpiry(minutes: number = 10): Date {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
  }

  async sendVerificationEmail(email: string, otp: string, name: string): Promise<boolean> {
    try {
      const fromEmail = this.configService.get<string>('EMAIL_FROM') || 'noreply@yourdomain.com';
      const fromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'Store App';

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Store App!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
          
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 30px 0;">
            <h1 style="color: #333; letter-spacing: 5px; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br/>
          <p>Best regards,<br/>Store App Team</p>
        </div>
      `;

      const response = await this.resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject: 'Verify Your Email - Store App',
        html: html,
      });

      this.logger.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      const fromEmail = this.configService.get<string>('EMAIL_FROM') || 'noreply@yourdomain.com';
      const fromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'Store App';

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Store App!</h2>
          <p>Hello ${name},</p>
          <p>Your email has been successfully verified. You can now log in to your account.</p>
          <p>Thank you for joining us!</p>
          <br/>
          <p>Best regards,<br/>Store App Team</p>
        </div>
      `;

      await this.resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject: 'Welcome to Store App!',
        html: html,
      });

      this.logger.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      return false;
    }
  }
}