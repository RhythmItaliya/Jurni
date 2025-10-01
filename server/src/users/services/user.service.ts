import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, TempUser, TempUserDocument } from '../models';
import { RegisterDto, LoginDto } from '@auth/dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TempUser.name) private tempUserModel: Model<TempUserDocument>,
  ) {}

  /**
   * Register new user
   * @param registerDto - Registration data
   * @returns Created user object
   */
  async register(registerDto: RegisterDto): Promise<UserDocument> {
    // Check if email already exists (including inactive users)
    const existingEmail = await this.userModel.findOne({
      email: registerDto.email,
    });
    if (existingEmail) {
      if (existingEmail.isActive) {
        throw new ConflictException(
          'Email address is already registered and verified',
        );
      } else {
        throw new ConflictException(
          'Email address is already registered but not verified. Please check your email for verification OTP or register with a different email.',
        );
      }
    }

    // Check if username already exists (including inactive users)
    const existingUsername = await this.userModel.findOne({
      username: registerDto.username,
    });
    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user with inactive status and UUID
    const user = new this.userModel({
      uuid: uuidv4(), // Generate unique UUID
      ...registerDto,
      password: hashedPassword,
      isActive: false, // User must verify OTP first
    });

    return await user.save();
  }

  /**
   * Login user
   * @param loginDto - Login credentials
   * @returns User object if credentials are valid
   */
  async login(loginDto: LoginDto): Promise<UserDocument> {
    const user = await this.findByUsernameOrEmail(loginDto.usernameOrEmail);

    if (!user) {
      throw new UnauthorizedException(
        'No account found with these credentials',
      );
    }

    // Check if user account is active
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account is inactive. Please verify your email first.',
      );
    }

    const isPasswordValid = await this.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }

  /**
   * Compare password with hash
   * @param password - Plain text password
   * @param hash - Hashed password
   * @returns True if passwords match
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Find user by email address
   * @param email - User email address
   * @returns User object or null
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  /**
   * Find user by username or email
   * @param usernameOrEmail - Username or email address
   * @returns User object or null
   */
  async findByUsernameOrEmail(usernameOrEmail: string) {
    return this.userModel.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
  }

  /**
   * Find user by UUID
   * @param uuid - User UUID
   * @returns User document
   */
  async findByUuid(uuid: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ uuid }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Find user by username
   * @param username - Username
   * @returns User document or null
   */
  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  /**
   * Get all users (without passwords)
   * @returns Array of user documents
   */
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }

  /**
   * Update user
   * @param uuid - User UUID
   * @param updateUserDto - Update data
   * @returns Updated user document
   */
  async update(uuid: string, updateUserDto: any): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndUpdate(
        { uuid },
        { ...updateUserDto, updatedAt: new Date() },
        { new: true, runValidators: true },
      )
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Delete user
   * @param uuid - User UUID
   * @returns Deleted user document
   */
  async remove(uuid: string): Promise<UserDocument> {
    const user = await this.userModel.findOneAndDelete({ uuid }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Find temporary user by email
   * @param email - User email address
   * @returns Temporary user object or null
   */
  async findTempUserByEmail(email: string): Promise<TempUserDocument | null> {
    return await this.tempUserModel.findOne({ email });
  }

  /**
   * Move temporary user to main users table after OTP verification
   * @param email - Email of temporary user to move
   * @returns Created user object
   */
  async moveTempUserToMain(email: string): Promise<UserDocument> {
    const tempUser = await this.findTempUserByEmail(email);
    if (!tempUser) {
      throw new NotFoundException('Temporary user not found');
    }

    // Create user in main table
    const user = new this.userModel({
      uuid: tempUser.uuid,
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      isActive: true,
      otpVerifiedAt: new Date(),
    });

    const savedUser = await user.save();

    // Delete temporary user
    await this.tempUserModel.deleteOne({ _id: tempUser._id });

    return savedUser;
  }

  /**
   * Update existing temporary user or create new one (more efficient)
   * @param registerDto - Registration data
   * @returns Updated or created temporary user object
   */
  async upsertTempUser(registerDto: RegisterDto): Promise<TempUserDocument> {
    // Check if email already exists in main users table
    const existingEmail = await this.userModel.findOne({
      email: registerDto.email,
    });
    if (existingEmail) {
      if (existingEmail.isActive) {
        throw new ConflictException(
          'Email address is already registered and verified',
        );
      } else {
        throw new ConflictException(
          'Email address is already registered but not verified. Please check your email for verification OTP or register with a different email.',
        );
      }
    }

    // Check if username already exists in main users table
    const existingUsername = await this.userModel.findOne({
      username: registerDto.username,
    });
    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Use findOneAndUpdate with upsert for better performance
    const tempUser = await this.tempUserModel.findOneAndUpdate(
      {
        $or: [{ email: registerDto.email }, { username: registerDto.username }],
      },
      {
        $set: {
          username: registerDto.username,
          email: registerDto.email,
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          uuid: uuidv4(),
          createdAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return tempUser;
  }

  /**
   * Update temporary user email or username
   * @param email - Current email of temporary user
   * @param updateData - New email or username
   * @returns Updated temporary user object
   */
  async updateTempUser(
    email: string,
    updateData: { email?: string; username?: string },
  ): Promise<TempUserDocument> {
    const tempUser = await this.findTempUserByEmail(email);
    if (!tempUser) {
      throw new NotFoundException('Temporary user not found');
    }

    // Check if new email/username already exists in main users table
    if (updateData.email && updateData.email !== email) {
      const existingEmail = await this.userModel.findOne({
        email: updateData.email,
      });
      if (existingEmail) {
        throw new ConflictException('Email address is already registered');
      }
    }

    if (updateData.username && updateData.username !== tempUser.username) {
      const existingUsername = await this.userModel.findOne({
        username: updateData.username,
      });
      if (existingUsername) {
        throw new ConflictException('Username is already taken');
      }
    }

    // Check if new email/username already exists in other temporary users
    if (updateData.email && updateData.email !== email) {
      const existingTempEmail = await this.tempUserModel.findOne({
        email: updateData.email,
        _id: { $ne: tempUser._id },
      });
      if (existingTempEmail) {
        throw new ConflictException(
          'Email address is already being used in another registration',
        );
      }
    }

    if (updateData.username && updateData.username !== tempUser.username) {
      const existingTempUsername = await this.tempUserModel.findOne({
        username: updateData.username,
        _id: { $ne: tempUser._id },
      });
      if (existingTempUsername) {
        throw new ConflictException(
          'Username is already being used in another registration',
        );
      }
    }

    // Update the temporary user
    if (updateData.email) tempUser.email = updateData.email;
    if (updateData.username) tempUser.username = updateData.username;
    tempUser.updatedAt = new Date();

    return await tempUser.save();
  }

  /**
   * Clean up expired temporary users
   * This is handled automatically by MongoDB TTL index, but can be called manually
   */
  async cleanupExpiredTempUsers(): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await this.tempUserModel.deleteMany({
      createdAt: { $lt: oneHourAgo },
    });
  }

  /**
   * Find user by reset token (for password reset)
   * @param token - Reset token
   * @returns User document or null
   */
  async findByResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ resetToken: token }).exec();
  }

  /**
   * Update user password
   * @param uuid - User UUID
   * @param password - New password (plain text)
   * @returns Updated user document
   */
  async updatePassword(uuid: string, password: string): Promise<UserDocument> {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    const user = await this.userModel
      .findOneAndUpdate(
        { uuid },
        {
          password: hashedPassword,
          updatedAt: new Date(),
          resetToken: null, // Clear any reset token
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
