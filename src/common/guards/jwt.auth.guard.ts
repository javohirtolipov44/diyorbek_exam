import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { access_token } = request.cookies?.access_token;

    if (!access_token) {
      throw new UnauthorizedException('Token cookie ichida topilmadi');
    }

    try {
      const payload = await this.jwtService.verifyAsync(access_token, {
        secret: 'sasasas',
      });
      request['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException('Token yaroqsiz yoki muddati tugagan');
    }

    return true;
  }
}
