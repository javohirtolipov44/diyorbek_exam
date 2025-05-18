import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './movie/movie.module';
import { ReviewModule } from './review/review.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateadminModule } from './createadmin/createadmin.module';
import { CreateadminService } from './createadmin/createadmin.service';

@Module({
  imports: [
    UsersModule,
    CategoriesModule,
    AuthModule,
    PrismaModule,
    MovieModule,
    ReviewModule,
    SubscriptionModule,
    FavoritesModule,
    AdminModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'Apple1213',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    CreateadminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly adminService: CreateadminService) {}

  async onModuleInit() {
    await this.adminService.createSuperAdmin();
  }
}
