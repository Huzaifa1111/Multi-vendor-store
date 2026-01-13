// apps/backend/src/modules/auth/dto/verify-otp.dto.ts - NEW FILE
import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  otp: string;
}

export class ResendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}