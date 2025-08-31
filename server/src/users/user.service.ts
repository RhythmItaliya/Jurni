import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Register new user
   * @param registerDto - Registration data
   * @returns Created user object
   */
  async register(registerDto: RegisterDto): Promise<UserDocument> {
    // Check if email already exists
    const existingEmail = await this.userModel.findOne({
      email: registerDto.email,
    });
    if (existingEmail) {
      throw new ConflictException('Email address is already registered');
    }

    // Check if username already exists
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
   * Activate user account after OTP verification
   * @param email - User email address
   * @returns Updated user object
   */
  async activateUser(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = true;
    return await user.save();
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
   * Find user by email
   * @param email - User email
   * @returns User document or null
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
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
}
