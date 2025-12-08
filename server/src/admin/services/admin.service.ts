import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Admin, AdminDocument } from '@/admin/models';
import {
  AdminRegisterDto,
  UpdateAdminDto,
  ChangeAdminPasswordDto,
} from '@/admin/dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  /**
   * Find admin by UUID
   * @param uuid - Admin UUID
   * @returns Admin document
   */
  async findByUuid(uuid: string): Promise<AdminDocument> {
    const admin = await this.adminModel.findOne({ uuid }).exec();
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  /**
   * Find admin by username or email
   * @param usernameOrEmail - Username or email
   * @returns Admin document or null
   */
  async findByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<AdminDocument | null> {
    return this.adminModel
      .findOne({
        $or: [
          { username: usernameOrEmail.toLowerCase() },
          { email: usernameOrEmail.toLowerCase() },
        ],
      })
      .exec();
  }

  /**
   * Create new admin
   * @param registerDto - Admin registration data
   * @returns Created admin document
   */
  async createAdmin(registerDto: AdminRegisterDto): Promise<AdminDocument> {
    // Check if admin already exists
    const existingAdmin = await this.findByUsernameOrEmail(
      registerDto.username,
    );
    if (existingAdmin) {
      throw new ConflictException(
        'Admin with this username/email already exists',
      );
    }

    const existingEmail = await this.findByUsernameOrEmail(registerDto.email);
    if (existingEmail) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create admin
    const admin = new this.adminModel({
      uuid: uuidv4(),
      username: registerDto.username.toLowerCase(),
      email: registerDto.email.toLowerCase(),
      password: hashedPassword,
      role: registerDto.role || 'moderator',
      isActive: true,
      permissions: this.getDefaultPermissions(registerDto.role || 'moderator'),
    });

    return admin.save();
  }

  /**
   * Update admin
   * @param uuid - Admin UUID
   * @param updateDto - Update data
   * @returns Updated admin document
   */
  async updateAdmin(
    uuid: string,
    updateDto: UpdateAdminDto,
  ): Promise<AdminDocument> {
    const admin = await this.findByUuid(uuid);

    // Check for username conflicts
    if (updateDto.username) {
      const existingAdmin = await this.adminModel
        .findOne({
          username: updateDto.username.toLowerCase(),
          uuid: { $ne: uuid },
        })
        .exec();
      if (existingAdmin) {
        throw new ConflictException('Username already exists');
      }
      admin.username = updateDto.username.toLowerCase();
    }

    // Check for email conflicts
    if (updateDto.email) {
      const existingAdmin = await this.adminModel
        .findOne({
          email: updateDto.email.toLowerCase(),
          uuid: { $ne: uuid },
        })
        .exec();
      if (existingAdmin) {
        throw new ConflictException('Email already exists');
      }
      admin.email = updateDto.email.toLowerCase();
    }

    if (updateDto.role !== undefined) admin.role = updateDto.role;
    if (updateDto.permissions !== undefined)
      admin.permissions = updateDto.permissions;

    return admin.save();
  }

  /**
   * Change admin password
   * @param uuid - Admin UUID
   * @param changePasswordDto - Password change data
   * @returns Updated admin document
   */
  async changePassword(
    uuid: string,
    changePasswordDto: ChangeAdminPasswordDto,
  ): Promise<AdminDocument> {
    const admin = await this.findByUuid(uuid);

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      changePasswordDto.currentPassword,
      admin.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    admin.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    return admin.save();
  }

  /**
   * Delete admin
   * @param uuid - Admin UUID
   */
  async deleteAdmin(uuid: string): Promise<void> {
    const admin = await this.findByUuid(uuid);

    // Prevent deletion of super_admin
    if (admin.role === 'super_admin') {
      throw new BadRequestException('Super admin accounts cannot be deleted');
    }

    await admin.deleteOne();
  }

  /**
   * Get all admins
   * @returns List of admins
   */
  async getAllAdmins(): Promise<AdminDocument[]> {
    return this.adminModel.find().select('-password').exec();
  }

  /**
   * Update last login timestamp
   * @param uuid - Admin UUID
   */
  async updateLastLogin(uuid: string): Promise<void> {
    await this.adminModel
      .findOneAndUpdate({ uuid }, { lastLoginAt: new Date() })
      .exec();
  }

  /**
   * Compare password
   * @param password - Plain text password
   * @param hashedPassword - Hashed password
   * @returns True if passwords match
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Get default permissions based on role
   * @param role - Admin role
   * @returns Array of permissions
   */
  private getDefaultPermissions(role: string): string[] {
    const permissions = {
      super_admin: [
        'users.read',
        'users.write',
        'users.delete',
        'posts.read',
        'posts.write',
        'posts.delete',
        'comments.read',
        'comments.write',
        'comments.delete',
        'media.read',
        'media.delete',
        'reports.read',
        'reports.write',
        'settings.read',
        'settings.write',
        'admins.read',
        'admins.write',
        'admins.delete',
      ],
      admin: [
        'users.read',
        'users.write',
        'posts.read',
        'posts.write',
        'posts.delete',
        'comments.read',
        'comments.write',
        'comments.delete',
        'media.read',
        'media.delete',
        'reports.read',
        'reports.write',
      ],
      moderator: [
        'users.read',
        'posts.read',
        'posts.delete',
        'comments.read',
        'comments.delete',
        'media.read',
        'reports.read',
        'reports.write',
      ],
    };

    return permissions[role] || permissions.moderator;
  }
}
