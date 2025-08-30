import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@users/user.service';
import { ENV_VARS } from '@config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENV_VARS.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByUuid(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
