import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminRegisterDto } from '@/admin/dto';
import { createSuccessResponse } from '@/lib/response.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate admin credentials
   * @param usernameOrEmail - Username or email
   * @param password - Admin password
   * @returns Admin object without password or null
   */
  async validateAdmin(usernameOrEmail: string, password: string): Promise<any> {
    const admin =
      await this.adminService.findByUsernameOrEmail(usernameOrEmail);
    if (
      admin &&
      (await this.adminService.comparePassword(password, admin.password))
    ) {
      const { password: _, ...result } = admin.toObject();
      return result;
    }
    return null;
  }

  /**
   * Admin login
   * @param loginDto - Login credentials
   * @returns Access token and admin data
   */
  async login(loginDto: AdminLoginDto) {
    const admin = await this.validateAdmin(
      loginDto.usernameOrEmail,
      loginDto.password,
    );

    if (!admin) {
      throw new UnauthorizedException('Invalid username/email or password');
    }

    // Only allow active admins to login
    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account is deactivated');
    }

    // Update last login timestamp
    await this.adminService.updateLastLogin(admin.uuid);

    const payload = {
      email: admin.email,
      sub: admin.uuid,
      role: admin.role,
      type: 'admin',
    };

    return createSuccessResponse('Admin login successful', {
      accessToken: this.jwtService.sign(payload),
      admin: {
        uuid: admin.uuid,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
        lastLoginAt: admin.lastLoginAt?.toISOString(),
        createdAt: admin.createdAt.toISOString(),
        updatedAt: admin.updatedAt.toISOString(),
      },
    });
  }

  /**
   * Register new admin (super_admin only)
   * @param registerDto - Registration data
   * @returns Created admin data
   */
  async register(registerDto: AdminRegisterDto) {
    const admin = await this.adminService.createAdmin(registerDto);

    return createSuccessResponse('Admin created successfully', {
      admin: {
        uuid: admin.uuid,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
        createdAt: admin.createdAt.toISOString(),
        updatedAt: admin.updatedAt.toISOString(),
      },
    });
  }
}
