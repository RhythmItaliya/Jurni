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
import { SavePostService } from '@/saveposts/services/savepost.service';
import {
  CreateSavePostDto,
  SavePostResponseDto,
  SavePostStatsDto,
} from '@/saveposts/dto/savepost.dto';
import { BaseResponseDto, createSuccessResponse } from '@/lib/response.dto';
import { ENDPOINTS } from '@/lib/endpoints';

@ApiTags('SavePosts')
@Controller('saveposts')
@UseGuards(JwtAuthGuard)
export class SavePostController {
  constructor(private readonly savePostService: SavePostService) {}

  /**
   * Save a post
   * Endpoint: POST /saveposts/save
   * @param createSavePostDto - Save post data
   * @param req - Request object with user info
   * @returns Save post result
   */
  @Post(ENDPOINTS.SAVEPOSTS.SAVE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save a post' })
  @ApiResponse({
    status: 201,
    description: 'Post saved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid save data or already saved',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async savePost(
    @Body() createSavePostDto: CreateSavePostDto,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    const save = await this.savePostService.savePost(userId, createSavePostDto);

    return createSuccessResponse('Post saved successfully', {
      save: {
        _id: save._id,
        userId: {
          _id: save.userId,
          username: req.user.username,
        },
        postId: save.postId,
        createdAt: (save as any).createdAt,
        updatedAt: (save as any).updatedAt,
      },
    });
  }

  /**
   * Unsave a post
   * Endpoint: DELETE /saveposts/unsave/:postId
   * @param postId - ID of the post to unsave
   * @param req - Request object with user info
   * @returns Unsave result
   */
  @Delete(ENDPOINTS.SAVEPOSTS.UNSAVE(':postId'))
  @ApiOperation({ summary: 'Unsave a post' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post to unsave',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Post unsaved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Save not found' })
  async unsavePost(
    @Param('postId') postId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    await this.savePostService.unsavePost(userId, postId);

    return createSuccessResponse('Post unsaved successfully');
  }

  /**
   * Get save statistics for a post
   * Endpoint: GET /saveposts/stats/:postId
   * @param postId - ID of the post
   * @param req - Request object with user info
   * @returns Save statistics
   */
  @Get(ENDPOINTS.SAVEPOSTS.STATS(':postId'))
  @ApiOperation({ summary: 'Get save statistics for a post' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Save statistics retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getSaveStats(
    @Param('postId') postId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    const stats = await this.savePostService.getSaveStats(postId, userId);

    return createSuccessResponse('Save statistics retrieved successfully', {
      stats,
    });
  }

  /**
   * Get saved posts for the current user
   * Endpoint: GET /saveposts/list
   * @param page - Page number for pagination
   * @param limit - Number of saves per page
   * @param req - Request object with user info
   * @returns List of saved posts
   */
  @Get(ENDPOINTS.SAVEPOSTS.LIST)
  @ApiOperation({ summary: 'Get saved posts for the current user' })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of saves per page',
    example: 20,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Saved posts retrieved successfully',
    type: BaseResponseDto,
  })
  async getSavedPosts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    const result = await this.savePostService.getSavedPosts(
      userId,
      pageNum,
      limitNum,
    );

    return createSuccessResponse('Saved posts retrieved successfully', {
      saves: result.saves.map((save) => ({
        _id: save._id,
        userId: save.userId,
        postId: save.postId,
        createdAt: (save as any).createdAt,
        updatedAt: (save as any).updatedAt,
      })),
      meta: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        totalPages: Math.ceil(result.total / limitNum),
      },
    });
  }
}
