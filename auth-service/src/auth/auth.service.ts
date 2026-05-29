import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    await this.prisma.users.create({
      data: {
        first_name: registerDto.first_name,
        last_name: registerDto.last_name,
        email: registerDto.email,
        password: registerDto.password,
        role: 'CUSTOMER',
      },
    });

    return { message: 'Registration successful' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { id: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
