import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ENV_VARS } from '@config/env';
import { Admin, AdminDocument } from '../models';

/**
 * Service to seed initial super admin
 */
@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  /**
   * Called when the module is initialized
   * Seeds the super admin if it doesn't exist
   */
  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  /**
   * Seeds the super admin from environment variables
   */
  private async seedSuperAdmin() {
    try {
      const superAdminEmail = ENV_VARS.SUPER_ADMIN_EMAIL;
      const superAdminUsername = ENV_VARS.SUPER_ADMIN_USERNAME;
      const superAdminPassword = ENV_VARS.SUPER_ADMIN_PASSWORD;

      if (!superAdminEmail || !superAdminUsername || !superAdminPassword) {
        this.logger.warn(
          'Super admin credentials not found in environment variables. Skipping super admin seed.',
        );
        return;
      }

      // Check if super admin already exists
      const existingAdmin = await this.adminModel
        .findOne({ email: superAdminEmail })
        .exec();

      if (existingAdmin) {
        this.logger.log(
          `Super admin already exists with email: ${superAdminEmail}`,
        );
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

      // Create super admin
      const superAdmin = new this.adminModel({
        uuid: uuidv4(),
        username: superAdminUsername,
        email: superAdminEmail,
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        permissions: [
          'users.read',
          'users.write',
          'users.delete',
          'posts.read',
          'posts.write',
          'posts.delete',
          'reports.read',
          'reports.write',
          'reports.delete',
          'admins.read',
          'admins.write',
          'admins.delete',
          'analytics.read',
        ],
      });

      await superAdmin.save();

      this.logger.log(
        `Super admin created successfully with email: ${superAdminEmail}`,
      );
    } catch (error) {
      this.logger.error('Error seeding super admin:', error);
    }
  }
}
