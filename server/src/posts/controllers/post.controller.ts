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
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PostService } from '../services/post.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/services/user.service';
import { PostMediaService } from '../services/post-media.service';
import {
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  PostResponseDto,
} from '../dto';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postMediaService: PostMediaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Create a new post
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ): Promise<PostResponseDto> {
    try {
      const userId = req.user.id;
      const post = await this.postService.createPost(userId, createPostDto);

      return {
        success: true,
        message: 'Post created successfully',
        data: post,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create post',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Create post with media files atomically
   */
  @Post('with-media')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 5))
  async createPostWithMedia(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ): Promise<PostResponseDto> {
    try {
      const userId = req.user.id;
      const post = await this.postMediaService.createPostWithMedia(
        userId,
        createPostDto,
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
   */
  @Get()
  async getPosts(
    @Query() query: PostQueryDto,
    @Request() req: any,
  ): Promise<PostResponseDto> {
    try {
      const requestingUserId = req.user?.id;
      const result = await this.postService.getPosts(query, requestingUserId);

      return {
        success: true,
        message: 'Posts retrieved successfully',
        data: result.posts,
        meta: {
          page: result.page,
          limit: query.limit || 10,
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
   */
  @Get(':id')
  async getPostById(
    @Param('id') postId: string,
    @Request() req: any,
  ): Promise<PostResponseDto> {
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
   * Get posts by providing a JWT token (decodes token to find user)
   * Body: { token: string }
   */
  @Post('user-posts')
  async getPostsByToken(
    @Body('token') token: string,
  ): Promise<PostResponseDto> {
    try {
      if (!token) {
        throw new HttpException(
          { success: false, message: 'Token is required' },
          HttpStatus.BAD_REQUEST,
        );
      }

      let payload: any;
      try {
        payload = this.jwtService.verify(token);
      } catch (err) {
        throw new HttpException(
          { success: false, message: 'Invalid token' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userUuid = payload?.sub;
      if (!userUuid) {
        throw new HttpException(
          { success: false, message: 'Invalid token payload' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userService.findByUuid(userUuid);
      if (!user) {
        throw new HttpException(
          { success: false, message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Use postService.getPosts with userId filter
      const userIdStr = (user as any)._id?.toString
        ? (user as any)._id.toString()
        : (user as any)._id;
      const result = await this.postService.getPosts(
        { userId: userIdStr as any },
        userIdStr,
      );

      return {
        success: true,
        message: 'Posts retrieved successfully',
        data: result.posts,
        meta: {
          page: result.page,
          limit: 10,
          total: result.total,
          totalPages: result.totalPages,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve posts by token',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Update a post
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ): Promise<PostResponseDto> {
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
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param('id') postId: string,
    @Request() req: any,
  ): Promise<PostResponseDto> {
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
