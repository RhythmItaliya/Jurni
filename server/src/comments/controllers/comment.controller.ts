import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CommentService } from '@/comments/services/comment.service';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentQueryDto,
  CommentResponseDto,
} from '@/comments/dto';
import { ENDPOINTS } from '@/lib/endpoints';
import { BaseResponseDto, createSuccessResponse } from '@/lib/response.dto';
import { CommentUtils } from '@/comments/utils/comment.utils';

@ApiTags('Comments')
@Controller('posts/:postId/comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * Create a new comment on a post
   * Endpoint: POST /posts/:postId/comments/create
   * @param postId - ID of the post to comment on
   * @param createCommentDto - Comment creation data
   * @param req - Request object with user info
   * @returns Comment creation result
   */
  @Post(ENDPOINTS.COMMENTS.CREATE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post to comment on',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid comment data' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    const comment = await this.commentService.createComment(
      userId,
      postId,
      createCommentDto,
    );

    return createSuccessResponse('Comment created successfully', {
      comment: {
        _id: comment._id,
        content: comment.content,
        postId: comment.postId,
        userId: {
          _id: comment.userId,
          username: req.user.username,
        },
        parentId: comment.parentId,
        status: comment.status,
        likesCount: comment.likesCount,
        repliesCount: comment.repliesCount,
        createdAt: (comment as any).createdAt,
        updatedAt: (comment as any).updatedAt,
      },
    });
  }

  /**
   * Get comments for a post
   * Endpoint: GET /posts/:postId/comments/list
   * @param postId - ID of the post
   * @param query - Query parameters for pagination and filtering
   * @returns List of comments
   */
  @Get(ENDPOINTS.COMMENTS.GET_BY_POST)
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getCommentsForPost(
    @Param('postId') postId: string,
    @Query() query: CommentQueryDto,
  ): Promise<BaseResponseDto> {
    const result = await this.commentService.getCommentsForPost(postId, query);

    return createSuccessResponse('Comments retrieved successfully', {
      comments: result.comments,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  }

  /**
   * Update a comment
   * Endpoint: PUT /posts/:postId/comments/update/:commentId
   * @param postId - ID of the post
   * @param commentId - ID of the comment to update
   * @param updateCommentDto - Comment update data
   * @param req - Request object with user info
   * @returns Updated comment
   */
  @Put(ENDPOINTS.COMMENTS.UPDATE(':commentId'))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'commentId',
    description: 'ID of the comment to update',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Cannot update others comments' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    const comment = await this.commentService.updateComment(
      userId,
      commentId,
      updateCommentDto,
    );

    return createSuccessResponse('Comment updated successfully', {
      comment: {
        _id: comment._id,
        content: comment.content,
        updatedAt: (comment as any).updatedAt,
      },
    });
  }

  /**
   * Delete a comment
   * Endpoint: DELETE /posts/:postId/comments/delete/:commentId
   * @param postId - ID of the post
   * @param commentId - ID of the comment to delete
   * @param req - Request object with user info
   * @returns Comment deletion result
   */
  @Delete(ENDPOINTS.COMMENTS.DELETE(':commentId'))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'commentId',
    description: 'ID of the comment to delete',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Cannot delete others comments' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async deleteComment(
    @Param('commentId') commentId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    await this.commentService.deleteComment(userId, commentId);

    return createSuccessResponse('Comment deleted successfully');
  }

  /**
   * Toggle like on a comment
   * Endpoint: POST /posts/:postId/comments/like/:commentId
   * @param postId - ID of the post
   * @param commentId - ID of the comment to like/unlike
   * @param req - Request object with user info
   * @returns Like toggle result
   */
  @Post(ENDPOINTS.COMMENTS.LIKE(':commentId'))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Toggle like on a comment' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'commentId',
    description: 'ID of the comment to like/unlike',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Like toggled successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async toggleCommentLike(
    @Param('commentId') commentId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    const userId = req.user._id.toString();
    const result = await this.commentService.toggleCommentLike(
      userId,
      commentId,
    );

    return createSuccessResponse(
      result.liked ? 'Comment liked' : 'Comment unliked',
      {
        liked: result.liked,
        likesCount: result.likesCount,
      },
    );
  }
}
