import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || ![UserRole.admin, UserRole.superadmin].includes(user.role)) {
      throw new ForbiddenException(
        'Bu amal faqat adminlar uchun ruxsat etilgan',
      );
    }

    return true;
  }
}
