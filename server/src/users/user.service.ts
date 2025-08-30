import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
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

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    const { username, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel
      .findOne({
        $or: [{ email }, { username }],
      })
      .exec();

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with UUID
    const newUser = new this.userModel({
      uuid: uuidv4(),
      username,
      email,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async login(loginDto: LoginDto): Promise<UserDocument> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async findByUuid(uuid: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ uuid }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }

  async update(uuid: string, updateUserDto: any): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndUpdate({ uuid }, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(uuid: string): Promise<UserDocument> {
    const user = await this.userModel.findOneAndDelete({ uuid }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
