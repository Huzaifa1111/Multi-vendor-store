import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from '../users/user.entity'; // Import from user.entity

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'name', 'password', 'role', 'phone', 'createdAt'] 
    });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      this.logger.debug(`User validated: ${user.email}, Role: ${user.role}`);
      
      // Return user WITHOUT password, ensure role is included
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

    // Debug: Check role value
    this.logger.debug(`User role from DB: ${user.role}, Type: ${typeof user.role}`);
    this.logger.debug(`Is admin? ${user.role === UserRole.ADMIN}`);

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    this.logger.debug(`JWT Payload: ${JSON.stringify(payload)}`);

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // Already UserRole type
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.USER,
    });

    const savedUser = await this.usersRepository.save(user);
    
    const payload = { 
      email: savedUser.email, 
      sub: savedUser.id, 
      role: savedUser.role 
    };
    
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role as UserRole,
      },
    };
  }

  async getProfile(userId: number): Promise<any> {
  console.log('Getting profile for user ID:', userId);
  
  const user = await this.usersRepository.findOne({ 
    where: { id: userId },
    select: ['id', 'email', 'name', 'role', 'phone', 'createdAt']
  });
  
  if (!user) {
    throw new UnauthorizedException('User not found');
  }
  
  console.log('Found user:', user.email);
  return user;
}
}