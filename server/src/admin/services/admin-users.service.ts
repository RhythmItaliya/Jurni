import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/users/models';
import { AdminUpdateUserDto } from '@/admin/dto';

@Injectable()
export class AdminUsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Get all users with complete information
   * @returns Array of all users with all details
   */
  async getAllUsers(): Promise<Partial<UserDocument>[]> {
    const users = await this.userModel
      .find()
      .select(
        'uuid username email isActive isSuspended otpVerifiedAt avatarImage createdAt updatedAt',
      )
      .exec();

    if (!users || users.length === 0) {
      return [];
    }

    return users.map((user) => this.formatUserResponse(user));
  }

  /**
   * Get user by UUID with complete information
   * @param uuid - User UUID
   * @returns User document with all details
   */
  async getUserByUuid(uuid: string): Promise<Partial<UserDocument>> {
    const user = await this.userModel
      .findOne({ uuid })
      .select(
        'uuid username email isActive isSuspended otpVerifiedAt avatarImage createdAt updatedAt',
      )
      .exec();

    if (!user) {
      throw new NotFoundException(`User with UUID ${uuid} not found`);
    }

    return this.formatUserResponse(user);
  }

  /**
   * Update user (suspend/unsuspend/activate/deactivate)
   * @param uuid - User UUID
   * @param updateDto - Update data (isSuspended, isActive)
   * @returns Updated user document
   */
  async updateUser(
    uuid: string,
    updateDto: AdminUpdateUserDto,
  ): Promise<Partial<UserDocument>> {
    const user = await this.userModel.findOne({ uuid }).exec();

    if (!user) {
      throw new NotFoundException(`User with UUID ${uuid} not found`);
    }

    // Update suspended status if provided
    if (updateDto.isSuspended !== undefined) {
      user.isSuspended = updateDto.isSuspended;
    }

    // Update active status if provided
    if (updateDto.isActive !== undefined) {
      user.isActive = updateDto.isActive;
    }

    await user.save();

    return this.formatUserResponse(user);
  }

  /**
   * Delete user by UUID
   * @param uuid - User UUID
   * @returns Confirmation message
   */
  async deleteUser(uuid: string): Promise<{ message: string; uuid: string }> {
    const user = await this.userModel.findOne({ uuid }).exec();

    if (!user) {
      throw new NotFoundException(`User with UUID ${uuid} not found`);
    }

    await this.userModel.deleteOne({ uuid }).exec();

    return {
      message: `User ${user.username} has been deleted successfully`,
      uuid,
    };
  }

  /**
   * Format user response to include all necessary information
   * @param user - User document
   * @returns Formatted user object
   */
  private formatUserResponse(user: UserDocument): Partial<UserDocument> {
    return {
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      isSuspended: user.isSuspended,
      otpVerifiedAt: user.otpVerifiedAt,
      avatarImage: user.avatarImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
