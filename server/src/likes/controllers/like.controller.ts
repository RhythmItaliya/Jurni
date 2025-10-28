import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { LikeService } from '@/likes/services/like.service';
import {
  CreateLikeDto,
  LikeResponseDto,
  LikeStatsDto,
} from '@/likes/dto/like.dto';
import { BaseResponseDto, createSuccessResponse } from '@/lib/response.dto';
import { ENDPOINTS } from '@/lib/endpoints';

@ApiTags('Likes')
@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  /**
   * Like a post or comment
   * Endpoint: POST /likes/like
   * @param createLikeDto - Like creation data
   * @param req - Request object with user info
   * @returns Like creation result
   */
  @Post(ENDPOINTS.LIKES.LIKE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Like a post or comment' })
  @ApiResponse({
    status: 201,
    description: 'Like created successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid like data or already liked',
  })
  @ApiResponse({ status: 404, description: 'Target not found' })
  async likeTarget(
    @Body() createLikeDto: CreateLikeDto,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    const like = await this.likeService.likeTarget(userId, createLikeDto);

    return createSuccessResponse('Like created successfully', {
      like: {
        _id: like._id,
        userId: {
          _id: like.userId,
          username: req.user.username,
        },
        targetType: like.targetType,
        targetId: like.targetId,
        createdAt: (like as any).createdAt,
        updatedAt: (like as any).updatedAt,
      },
    });
  }

  /**
   * Unlike a post or comment
   * Endpoint: DELETE /likes/unlike/:targetType/:targetId
   * @param targetType - Type of target (post or comment)
   * @param targetId - ID of the target
   * @param req - Request object with user info
   * @returns Unlike result
   */
  @Delete(ENDPOINTS.LIKES.UNLIKE(':targetType', ':targetId'))
  @ApiOperation({ summary: 'Unlike a post or comment' })
  @ApiParam({
    name: 'targetType',
    description: 'Type of target to unlike',
    enum: ['post', 'comment'],
    example: 'post',
  })
  @ApiParam({
    name: 'targetId',
    description: 'ID of the target to unlike',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Unlike successful',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Like not found' })
  async unlikeTarget(
    @Param('targetType') targetType: 'post' | 'comment',
    @Param('targetId') targetId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    await this.likeService.unlikeTarget(userId, targetType, targetId);

    return createSuccessResponse('Unlike successful');
  }

  /**
   * Get like statistics for a target
   * Endpoint: GET /likes/stats/:targetType/:targetId
   * @param targetType - Type of target
   * @param targetId - ID of the target
   * @param req - Request object with user info
   * @returns Like statistics
   */
  @Get(ENDPOINTS.LIKES.STATS(':targetType', ':targetId'))
  @ApiOperation({ summary: 'Get like statistics for a target' })
  @ApiParam({
    name: 'targetType',
    description: 'Type of target',
    enum: ['post', 'comment'],
    example: 'post',
  })
  @ApiParam({
    name: 'targetId',
    description: 'ID of the target',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Like statistics retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Target not found' })
  async getLikeStats(
    @Param('targetType') targetType: 'post' | 'comment',
    @Param('targetId') targetId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    const stats = await this.likeService.getLikeStats(
      targetType,
      targetId,
      userId,
    );

    return createSuccessResponse('Like statistics retrieved successfully', {
      stats,
    });
  }

  /**
   * Get likes for a target
   * Endpoint: GET /likes/:targetType/:targetId
   * @param targetType - Type of target
   * @param targetId - ID of the target
   * @param page - Page number for pagination
   * @param limit - Number of likes per page
   * @returns List of likes
   */
  @Get(ENDPOINTS.LIKES.GET_LIKES(':targetType', ':targetId'))
  @ApiOperation({ summary: 'Get likes for a target' })
  @ApiParam({
    name: 'targetType',
    description: 'Type of target',
    enum: ['post', 'comment'],
    example: 'post',
  })
  @ApiParam({
    name: 'targetId',
    description: 'ID of the target',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of likes per page',
    example: 20,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Likes retrieved successfully',
    type: BaseResponseDto,
  })
  async getLikesForTarget(
    @Param('targetType') targetType: 'post' | 'comment',
    @Param('targetId') targetId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<BaseResponseDto> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    const result = await this.likeService.getLikesForTarget(
      targetType,
      targetId,
      pageNum,
      limitNum,
    );

    return createSuccessResponse('Likes retrieved successfully', {
      likes: result.likes.map((like) => ({
        _id: like._id,
        userId: like.userId,
        targetType: like.targetType,
        targetId: like.targetId,
        createdAt: (like as any).createdAt,
        updatedAt: (like as any).updatedAt,
      })),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  }
}
