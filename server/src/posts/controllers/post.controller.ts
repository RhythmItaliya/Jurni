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
  HttpException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { PostService } from '@/posts/services/post.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@users/services/user.service';
import { PostMediaService } from '@/posts/services/post-media.service';
import {
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  PostResponseDto,
} from '@/posts/dto';
import { ENDPOINTS } from '@/lib/endpoints';
import { BaseResponseDto } from '@/lib/response.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postMediaService: PostMediaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Create post with media files atomically
   * Endpoint: POST /posts/create
   * @param body - Post creation data (multipart form data)
   * @param files - Uploaded media files
   * @param req - Request object with user info
   * @returns Post creation result
   */
  @Post(ENDPOINTS.POSTS.CREATE)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiOperation({ summary: 'Create post with media files' })
  @ApiResponse({
    status: 201,
    description: 'Post created with media successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Failed to create post with media' })
  async createPostWithMedia(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const userId = req.user.id;
      const post = await this.postMediaService.createPostWithMedia(
        userId,
        body as CreatePostDto,
        files,
      );

      return {
        success: true,
        message: 'Post created with media successfully',
        data: post,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create post with media',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get posts with filtering and pagination
   * Endpoint: GET /posts/list
   * @param query - Query parameters for filtering and pagination
   * @param req - Request object with user info
   * @returns Posts list with pagination metadata
   */
  @Get(ENDPOINTS.POSTS.LIST)
  @ApiOperation({ summary: 'Get posts with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Failed to retrieve posts' })
  async getPosts(
    @Query() query: PostQueryDto,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const requestingUserId = req.user?.id;
      const result = await this.postService.getPosts(query, requestingUserId);

      return {
        success: true,
        message: 'Posts retrieved successfully',
        data: result.posts,
        meta: {
          page: result.page,
          limit: query.limit || 2,
          total: result.total,
          totalPages: result.totalPages,
        },
      };
    } catch (error) {
      console.error('getPosts error:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve posts',
          error: error.message || 'Unknown error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get a single post by ID
   * Endpoint: GET /posts/detail/:id
   * @param postId - Post ID to retrieve
   * @param req - Request object with user info
   * @returns Single post data
   */
  @Get(ENDPOINTS.POSTS.DETAIL('').replace('/', '') + '/:id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 400, description: 'Failed to retrieve post' })
  async getPostById(
    @Param('id') postId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const requestingUserId = req.user?.id;
      const post = await this.postService.getPostById(postId, requestingUserId);

      return {
        success: true,
        message: 'Post retrieved successfully',
        data: post,
      };
    } catch (error) {
      const status = error.status || HttpStatus.BAD_REQUEST;
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve post',
          error: error.message,
        },
        status,
      );
    }
  }

  /**
   * Update a post
   * Endpoint: PUT /posts/update/:id
   * @param postId - Post ID to update
   * @param updatePostDto - Post update data
   * @param req - Request object with user info
   * @returns Post update result
   */
  @Put(ENDPOINTS.POSTS.UPDATE('').replace('/', '') + '/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized to update post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 400, description: 'Failed to update post' })
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const userId = req.user.id;
      const post = await this.postService.updatePost(
        postId,
        userId,
        updatePostDto,
      );

      return {
        success: true,
        message: 'Post updated successfully',
        data: post,
      };
    } catch (error) {
      const status = error.status || HttpStatus.BAD_REQUEST;
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update post',
          error: error.message,
        },
        status,
      );
    }
  }

  /**
   * Delete a post
   * Endpoint: DELETE /posts/delete/:id
   * @param postId - Post ID to delete
   * @param req - Request object with user info
   * @returns Post deletion result
   */
  @Delete(ENDPOINTS.POSTS.DELETE('').replace('/', '') + '/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized to delete post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 400, description: 'Failed to delete post' })
  async deletePost(
    @Param('id') postId: string,
    @Request() req: any,
  ): Promise<BaseResponseDto> {
    try {
      const userId = req.user.id;
      await this.postService.deletePost(postId, userId);

      return {
        success: true,
        message: 'Post deleted successfully',
      };
    } catch (error) {
      const status = error.status || HttpStatus.BAD_REQUEST;
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete post',
          error: error.message,
        },
        status,
      );
    }
  }
}
