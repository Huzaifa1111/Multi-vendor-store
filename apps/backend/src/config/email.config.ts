// apps/backend/src/config/email.config.ts
export interface EmailConfig {
  resendApiKey: string;
  fromEmail: string;
  fromName: string;
}

export const emailConfig = (): EmailConfig => ({
  resendApiKey: process.env.RESEND_API_KEY || '',
  fromEmail: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
  fromName: process.env.EMAIL_FROM_NAME || 'Store App',
});