// apps/backend/src/modules/auth/auth.service.ts - UPDATED
import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException, 
  Logger,
  BadRequestException,
  NotFoundException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto, ResendOtpDto } from './dto/verify-otp.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from '../users/user.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'name', 'password', 'role', 'phone', 'createdAt', 'isEmailVerified'] 
    });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      this.logger.debug(`User validated: ${user.email}, Role: ${user.role}`);
      
      // Check if email is verified
      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email first');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.debug(`Login attempt for: ${loginDto.email}`);
    
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };

    this.logger.debug(`JWT Payload: ${JSON.stringify(payload)}`);

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified, // Added
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const otp = this.emailService.generateOtp();
    const otpExpiresAt = this.emailService.calculateOtpExpiry();

    const user = this.usersRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.USER,
      phone: registerDto.phone,
      isEmailVerified: false,
      verificationOtp: otp,
      otpExpiresAt: otpExpiresAt,
    });

    const savedUser = await this.usersRepository.save(user);
    
    // Send OTP email
    const emailSent = await this.emailService.sendVerificationEmail(
      savedUser.email,
      otp,
      savedUser.name
    );

    if (!emailSent) {
      this.logger.error(`Failed to send OTP email to ${savedUser.email}`);
      // Don't fail registration if email fails, but log it
    }

    // Return without token - user needs to verify email first
    return {
      message: 'Registration successful. Please check your email for verification OTP.',
      userId: savedUser.id,
      email: savedUser.email,
      requiresVerification: true,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email: verifyOtpDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if OTP is valid and not expired
    if (!user.verificationOtp || !user.otpExpiresAt) {
      throw new BadRequestException('No OTP requested or OTP expired');
    }

    if (user.verificationOtp !== verifyOtpDto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > user.otpExpiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    // Update user as verified and clear OTP
    user.isEmailVerified = true;
    user.verificationOtp = null;
    user.otpExpiresAt = null;
    
    await this.usersRepository.save(user);

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    // Generate JWT token
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      isEmailVerified: true
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: true, // Added
      },
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: resendOtpDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new OTP
    const otp = this.emailService.generateOtp();
    const otpExpiresAt = this.emailService.calculateOtpExpiry();

    // Update user with new OTP
    user.verificationOtp = otp;
    user.otpExpiresAt = otpExpiresAt;
    
    await this.usersRepository.save(user);

    // Send new OTP email
    const emailSent = await this.emailService.sendVerificationEmail(
      user.email,
      otp,
      user.name
    );

    if (!emailSent) {
      throw new BadRequestException('Failed to send OTP email');
    }

    return {
      message: 'New OTP has been sent to your email',
      email: user.email,
    };
  }

  async getProfile(userId: number): Promise<any> {
    console.log('Getting profile for user ID:', userId);
    
    const user = await this.usersRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'email', 'name', 'role', 'phone', 'createdAt', 'isEmailVerified']
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    console.log('Found user:', user.email);
    return user;
  }
}