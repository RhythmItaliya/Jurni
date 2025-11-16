import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
  Body,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProfileService } from '../services/profile.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import {
  UpdateProfileDto,
  PublicProfileResponseDto,
  CompleteProfileResponseDto,
} from '../dto/profile.dto';
import { ENDPOINTS } from '@/lib/endpoints';
import { BaseResponseDto } from '@/lib/response.dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get current user's complete profile for editing
   * Endpoint: GET /profiles/me
   * IMPORTANT: Must be defined BEFORE :username route to avoid route conflict
   * @param req - Request object with authenticated user
   * @returns Complete profile data with user information
   */
  @UseGuards(JwtAuthGuard)
  @Get(ENDPOINTS.PROFILES.GET_ME)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user complete profile for editing' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Complete profile retrieved successfully',
    type: CompleteProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getMyProfile(@Request() req: any): Promise<BaseResponseDto> {
    try {
      const user = req.user;
      const userId = user.uuid || user.sub || user._id;

      // Get raw data from service (returns { user, profile })
      const completeProfile =
        await this.profileService.getCompleteProfile(userId);

      return {
        success: true,
        message: 'Profile retrieved successfully',
        data: completeProfile,
      };
    } catch (error) {
      console.error('Error in getMyProfile:', error);
      return {
        success: false,
        message: error.message || 'Failed to retrieve profile',
        error: error.message,
      };
    }
  }

  /**
   * Get public profile by username
   * Endpoint: GET /profiles/:username
   * @param username - Username
   * @param req - Request object with user info (optional)
   * @returns Public profile data
   */
  @Get(ENDPOINTS.PROFILES.GET_BY_USERNAME(':username'))
  @ApiOperation({ summary: 'Get public profile by username' })
  @ApiParam({
    name: 'username',
    description: 'Username',
    example: 'johndoe',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully',
    type: PublicProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getProfile(
    @Param('username') username: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const viewerId = req.user?.id;
      const profile = await this.profileService.getProfileByUsername(
        username,
        viewerId,
      );
      return {
        success: true,
        message: 'Profile retrieved successfully',
        data: profile,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve profile',
        error: error.message,
      };
    }
  }

  /**
   * Update own profile with optional file uploads
   * Endpoint: PATCH /profiles
   * @param body - Profile update data (bio, location, isPrivate, firstName, lastName)
   * @param files - Uploaded files (coverImage and/or avatarImage)
   * @param req - Request object with user info
   * @returns Updated profile data
   */
  @Patch(ENDPOINTS.PROFILES.UPDATE)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'avatarImage', maxCount: 1 },
    ]),
  )
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update own profile with optional file uploads',
    description:
      'Update profile fields including bio, cover image (upload), avatar image (upload), location (with Nominatim data), privacy settings, and name. Supports multipart/form-data for file uploads.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    type: PublicProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid profile data or file upload failed',
  })
  async updateProfile(
    @Body() body: any,
    @UploadedFiles()
    files: {
      coverImage?: Express.Multer.File[];
      avatarImage?: Express.Multer.File[];
    },
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const user = req.user;
      const userId = user.uuid || user.sub || user._id?.toString();
      const userMongoId = user._id?.toString(); // MongoDB ObjectId for media uploads

      // Extract cover image and avatar image files
      const coverImageFile = files?.coverImage?.[0];
      const avatarImageFile = files?.avatarImage?.[0];

      const profile = await this.profileService.updateProfileWithMedia(
        userId,
        userMongoId,
        body as UpdateProfileDto,
        coverImageFile,
        avatarImageFile,
      );

      return {
        success: true,
        message: 'Profile updated successfully',
        data: profile,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update profile',
        error: error.message,
      };
    }
  }
}
