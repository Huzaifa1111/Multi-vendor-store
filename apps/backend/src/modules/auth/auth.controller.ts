import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuth() {
    return { 
      message: 'Auth endpoints',
      endpoints: {
        login: 'POST /auth/login',
        register: 'POST /auth/register',
        profile: 'GET /auth/profile (requires auth)',
        health: 'GET /auth/health'
      }
    };
  }

  @Get('health')
  healthCheck() {
    return { 
      status: 'OK', 
      message: 'Auth service is running',
      timestamp: new Date().toISOString()
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('📝 Login attempt for:', loginDto.email);
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('📝 Registration attempt for:', registerDto.email);
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('👤 Getting profile for user:', req.user?.email);
    return this.authService.getProfile(req.user?.userId || req.user?.sub);
  }
}