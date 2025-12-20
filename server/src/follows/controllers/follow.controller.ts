import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FollowService } from '../services/follow.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import {
  FollowResponseDto,
  FollowersResponseDto,
  FollowingResponseDto,
  FollowStatusResponseDto,
} from '../dto/follow.dto';
import { ENDPOINTS } from '@/lib/endpoints';
import { BaseResponseDto } from '@/lib/response.dto';

@ApiTags('Follows')
@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  /**
   * Follow a user
   * Endpoint: POST /follows/follow/:targetUserId
   * @param targetUserId - UUID of the user to follow
   * @param req - Request object with authenticated user
   * @returns Success response
   */
  @UseGuards(JwtAuthGuard)
  @Post(ENDPOINTS.FOLLOWS.FOLLOW(':targetUserId'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({
    name: 'targetUserId',
    description: 'UUID of the user to follow',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully followed user',
    type: FollowResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Already following or trying to follow yourself',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async followUser(
    @Param('targetUserId') targetUserId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const user = req.user;
      const followerId = user.uuid || user.sub || user._id;

      await this.followService.followUser(followerId, targetUserId);

      return {
        success: true,
        message: 'Successfully followed user',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to follow user',
        error: error.message,
      };
    }
  }

  /**
   * Unfollow a user
   * Endpoint: DELETE /follows/unfollow/:targetUserId
   * @param targetUserId - UUID of the user to unfollow
   * @param req - Request object with authenticated user
   * @returns Success response
   */
  @UseGuards(JwtAuthGuard)
  @Delete(ENDPOINTS.FOLLOWS.UNFOLLOW(':targetUserId'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({
    name: 'targetUserId',
    description: 'UUID of the user to unfollow',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully unfollowed user',
    type: FollowResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Follow relationship not found',
  })
  async unfollowUser(
    @Param('targetUserId') targetUserId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const user = req.user;
      const followerId = user.uuid || user.sub || user._id;

      await this.followService.unfollowUser(followerId, targetUserId);

      return {
        success: true,
        message: 'Successfully unfollowed user',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to unfollow user',
        error: error.message,
      };
    }
  }

  /**
   * Get followers of a user
   * Endpoint: GET /follows/followers/:userId
   * @param userId - UUID of the user
   * @param req - Request object with user info (optional)
   * @returns List of followers
   */
  @Get(ENDPOINTS.FOLLOWS.FOLLOWERS(':userId'))
  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiParam({
    name: 'userId',
    description: 'UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Followers retrieved successfully',
    type: FollowersResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getFollowers(
    @Param('userId') userId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      // Try to get authenticated user from header
      let currentUserId: string | undefined;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.substring(7);
          const decoded: any = require('jsonwebtoken').verify(
            token,
            process.env.JWT_SECRET,
          );
          currentUserId = decoded.sub;
        } catch (err) {
          // Token invalid or expired, continue as unauthenticated
        }
      }

      const followers = await this.followService.getFollowers(
        userId,
        currentUserId,
      );

      return {
        success: true,
        message: 'Followers retrieved successfully',
        data: followers,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve followers',
        error: error.message,
      };
    }
  }

  /**
   * Get users that a user is following
   * Endpoint: GET /follows/following/:userId
   * @param userId - UUID of the user
   * @param req - Request object with user info (optional)
   * @returns List of following
   */
  @Get(ENDPOINTS.FOLLOWS.FOLLOWING(':userId'))
  @ApiOperation({ summary: 'Get users that a user is following' })
  @ApiParam({
    name: 'userId',
    description: 'UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Following retrieved successfully',
    type: FollowingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getFollowing(
    @Param('userId') userId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      // Try to get authenticated user from header
      let currentUserId: string | undefined;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.substring(7);
          const decoded: any = require('jsonwebtoken').verify(
            token,
            process.env.JWT_SECRET,
          );
          currentUserId = decoded.sub;
        } catch (err) {
          // Token invalid or expired, continue as unauthenticated
        }
      }

      const following = await this.followService.getFollowing(
        userId,
        currentUserId,
      );

      return {
        success: true,
        message: 'Following retrieved successfully',
        data: following,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve following',
        error: error.message,
      };
    }
  }

  /**
   * Check follow status and get counts
   * Endpoint: GET /follows/status/:targetUserId
   * @param targetUserId - UUID of the target user
   * @param req - Request object with authenticated user
   * @returns Follow status and counts
   */
  @UseGuards(JwtAuthGuard)
  @Get(ENDPOINTS.FOLLOWS.STATUS(':targetUserId'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check follow status and get counts' })
  @ApiParam({
    name: 'targetUserId',
    description: 'UUID of the target user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Follow status retrieved successfully',
    type: FollowStatusResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getFollowStatus(
    @Param('targetUserId') targetUserId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const user = req.user;
      const followerId = user.uuid || user.sub || user._id;

      const status = await this.followService.getFollowStatus(
        followerId,
        targetUserId,
      );

      return {
        success: true,
        message: 'Follow status retrieved successfully',
        data: status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve follow status',
        error: error.message,
      };
    }
  }
}
