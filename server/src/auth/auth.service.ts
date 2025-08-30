import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@users/user.service';
import { LoginDto, RegisterDto } from '@users/dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userObj = user.toObject();
      const { password: _, ...result } = userObj;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.uuid };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.register(registerDto);
    const payload = { email: user.email, sub: user.uuid };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
      },
    };
  }
}
