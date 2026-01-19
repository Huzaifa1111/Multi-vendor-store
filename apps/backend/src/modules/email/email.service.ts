import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendOtpEmail(to: string, name: string, otp: string) {
    console.log(`[EMAIL SERVICE] OTP for ${name} (${to}): ${otp}`);
    // In production, implement nodemailer here
    return { sent: true, otp: otp };
  }

  async sendOrderConfirmation(to: string, name: string, orderId: string, orderDetails: any) {
    console.log(`[EMAIL SERVICE] Order #${orderId} confirmed for ${name} (${to})`);
    return { sent: true };
  }
}