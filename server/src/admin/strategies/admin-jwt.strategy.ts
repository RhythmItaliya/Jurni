import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '@/admin/services';
import { ENV_VARS } from '@config/env';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENV_VARS.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Check if token is for admin (has type: 'admin')
    if (payload.type !== 'admin') {
      throw new UnauthorizedException('Invalid token type');
    }

    const admin = await this.adminService.findByUuid(payload.sub);
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account is inactive');
    }

    return admin;
  }
}
