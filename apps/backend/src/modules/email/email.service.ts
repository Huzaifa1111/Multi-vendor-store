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
      if (!this.resend) {
        this.logger.error('Resend client not initialized. Check RESEND_API_KEY in .env');
        return false;
      }

      const fromEmail = this.configService.get<string>('EMAIL_FROM') || 'onboarding@resend.dev';
      const fromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'E-Store';

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #000;">Account Verification</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering with E-Store. Please use the following One-Time Password (OTP) to verify your email address:</p>
          
          <div style="background-color: #f8f8f8; padding: 20px; text-align: center; margin: 30px 0; border: 1px solid #eee; border-radius: 12px;">
            <h1 style="color: #000; letter-spacing: 8px; font-size: 36px; margin: 0; font-family: 'Courier New', Courier, monospace;">${otp}</h1>
          </div>
          
          <p>This code will expire in 10 minutes. If you did not create an account, please ignore this email.</p>
          <br/>
          <p>Best regards,<br/><strong>The E-Store Team</strong></p>
        </div>
      `;

      this.logger.debug(`Attempting to send OTP email to ${email} using ${fromEmail}`);

      const result = await this.resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject: 'Verify Your Email - E-Store',
        html: html,
      });

      if (result.error) {
        this.logger.error(`Resend API Error: ${JSON.stringify(result.error)}`);
        return false;
      }

      this.logger.log(`Verification email successfully sent to ${email}. ID: ${result.data?.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Unexpected error during sendVerificationEmail to ${email}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      if (!this.resend) {
        this.logger.error('Resend client not initialized for welcome email.');
        return false;
      }

      const fromEmail = this.configService.get<string>('EMAIL_FROM') || 'onboarding@resend.dev';
      const fromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'E-Store';

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #000;">Welcome to E-Store!</h2>
          <p>Hello ${name},</p>
          <p>Your email has been successfully verified. You can now log in and explore our collection.</p>
          <p>Thank you for choosing E-Store!</p>
          <br/>
          <p>Best regards,<br/><strong>The E-Store Team</strong></p>
        </div>
      `;

      const result = await this.resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject: 'Welcome to E-Store!',
        html: html,
      });

      if (result.error) {
        this.logger.error(`Resend API Error (Welcome): ${JSON.stringify(result.error)}`);
        return false;
      }

      this.logger.log(`Welcome email successfully sent to ${email}. ID: ${result.data?.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Unexpected error during sendWelcomeEmail to ${email}:`, error);
      return false;
    }
  }
}