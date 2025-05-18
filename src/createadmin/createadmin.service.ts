import { Injectable } from '@nestjs/common';
import { CreateCreateadminDto } from './dto/create-createadmin.dto';
import bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
@Injectable()
export class CreateadminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCreateadminDto: CreateCreateadminDto) {
    const { username, email, password, role } = createCreateadminDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return {
        success: false,
        message: 'Bu email bilan admin mavjud',
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = await this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash: passwordHash,
        role,
      },
    });

    return {
      success: true,
      message: 'Admin yaratildi',
      data: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    };
  }
  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
    return {
      success: true,
      message: 'Admin ochirildi',
    };
  }
  async createSuperAdmin() {
    const email = process.env.SUPERADMIN_EMAIL;
    const username = process.env.SUPERADMIN_USERNAME;
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!email || !username || !password) {
      console.warn('SUPERADMIN_* env sozlamalari topilmadi');
      return;
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (!existing) {
      const passwordHash = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          email,
          username,
          passwordHash,
          role: 'superadmin',
        },
      });
      console.log('SuperAdmin yaratildi');
    } else {
      console.log('SuperAdmin allaqachon mavjud');
    }
  }
}
