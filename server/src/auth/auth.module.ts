import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '@users/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { ENV_VARS } from '@config/env';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: ENV_VARS.JWT_SECRET,
      signOptions: { expiresIn: '24h' }, // 24 hours - Better balance
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
