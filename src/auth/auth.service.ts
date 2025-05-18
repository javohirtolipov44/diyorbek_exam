import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: { email: registerDto.email },
    });

    if (user) {
      throw new ConflictException("Siz allaqachon ro'yxatdan o'tgansiz");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const userdata = await this.prismaService.user.create({
      data: {
        username: registerDto.username,
        email: registerDto.email,
        passwordHash: hashedPassword,
      },
    });
    const token = await this.generateTokens(userdata.id, userdata.role);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
      data: {
        user_id: userdata.id,
        username: userdata.username,
        role: userdata.role,
        create_at: userdata.createdAt,
      },
    };
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email yoki parol notogri');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email yoki parol notogri');
    }
    const token = await this.generateTokens(user.id, user.role);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      message: 'Muvaffaqiyatli kirildi',
      data: {
        user_id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
  async logout(res: Response) {
    res.clearCookie('access_token');
    return {
      success: true,
      message: 'Tizimdan chiqdingiz',
    };
  }

  async generateTokens(userId: string, role: any) {
    const payload = { userId, role };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: 'sasasas',
    });

    return { access_token };
  }
}
