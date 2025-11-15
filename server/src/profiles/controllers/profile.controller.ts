import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
  Body,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProfileService } from '../services/profile.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UpdateProfileDto, PublicProfileResponseDto } from '../dto/profile.dto';
import { ENDPOINTS } from '@/lib/endpoints';
import { BaseResponseDto } from '@/lib/response.dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get public profile by username
   * Endpoint: GET /profiles/:username
   * @param username - Username
   * @param req - Request object with user info (optional)
   * @returns Public profile data
   */
  @Get(':username')
  @ApiOperation({ summary: 'Get public profile by username' })
  @ApiParam({
    name: 'username',
    description: 'Username',
    example: 'johndoe',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 404,
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
        message: error.message,
        error: error.message,
      };
    }
  }

  /**
   * Update own profile
   * Endpoint: PATCH /profiles
   * @param updateProfileDto - Profile update data
   * @param req - Request object with user info
   * @returns Updated profile data
   */
  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update own profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const userId = req.user.id;
      const profile = await this.profileService.updateProfile(
        userId,
        updateProfileDto,
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
