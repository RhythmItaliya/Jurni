import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Admin, AdminDocument } from '@/admin/models';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  /**
   * Initialize default super admin on module init
   */
  async onModuleInit() {
    await this.createDefaultSuperAdmin();
  }

  /**
   * Create default super admin if not exists
   */
  async createDefaultSuperAdmin() {
    try {
      // Check if any super admin exists
      const existingSuperAdmin = await this.adminModel
        .findOne({ role: 'super_admin' })
        .exec();

      if (existingSuperAdmin) {
        this.logger.log('Super admin already exists, skipping creation');
        return;
      }

      // Create default super admin
      const hashedPassword = await bcrypt.hash('12345678', 10);

      const superAdmin = new this.adminModel({
        uuid: uuidv4(),
        username: 'admin',
        email: 'admin@jurni.com',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        permissions: [
          'users:read',
          'users:write',
          'users:delete',
          'posts:read',
          'posts:write',
          'posts:delete',
          'comments:read',
          'comments:write',
          'comments:delete',
          'media:read',
          'media:write',
          'media:delete',
          'reports:read',
          'reports:write',
          'settings:read',
          'settings:write',
          'admins:read',
          'admins:write',
          'admins:delete',
        ],
      });

      await superAdmin.save();

      this.logger.log('Default super admin created successfully');
      this.logger.log('Username: admin');
      this.logger.log('Password: 12345678');
    } catch (error) {
      this.logger.error('Failed to create default super admin', error);
    }
  }
}
