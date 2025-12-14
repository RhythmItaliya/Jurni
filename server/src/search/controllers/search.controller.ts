import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Search for users by username or name
   * GET /search/users?query=...&page=1&limit=20
   */
  @Get('users')
  async searchUsers(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Search query is required',
        data: [],
      };
    }

    const results = await this.searchService.searchUsers(
      query,
      Math.max(1, page),
      Math.min(100, Math.max(1, limit)),
    );

    return {
      success: true,
      message: 'Users search results',
      data: results,
    };
  }

  /**
   * Search for posts by title, description, or hashtags
   * GET /search/posts?query=...&page=1&limit=20
   */
  @Get('posts')
  async searchPosts(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Search query is required',
        data: [],
      };
    }

    const results = await this.searchService.searchPosts(
      query,
      Math.max(1, page),
      Math.min(100, Math.max(1, limit)),
    );

    return {
      success: true,
      message: 'Posts search results',
      data: results,
    };
  }

  /**
   * Search for hashtags
   * GET /search/hashtags?query=...&limit=20
   */
  @Get('hashtags')
  async searchHashtags(
    @Query('query') query: string,
    @Query('limit') limit: number = 20,
  ) {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Search query is required',
        data: [],
      };
    }

    const results = await this.searchService.searchHashtags(
      query,
      Math.min(100, Math.max(1, limit)),
    );

    return {
      success: true,
      message: 'Hashtags search results',
      data: results,
    };
  }

  /**
   * Universal search across users, posts, and hashtags
   * GET /search?query=...&type=all&page=1&limit=20
   */
  @Get()
  async search(
    @Query('query') query: string,
    @Query('type') type: 'all' | 'users' | 'posts' | 'hashtags' = 'all',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Search query is required',
        data: [],
      };
    }

    let results;

    switch (type) {
      case 'users':
        results = await this.searchService.searchUsers(
          query,
          Math.max(1, page),
          Math.min(100, Math.max(1, limit)),
        );
        break;
      case 'posts':
        results = await this.searchService.searchPosts(
          query,
          Math.max(1, page),
          Math.min(100, Math.max(1, limit)),
        );
        break;
      case 'hashtags':
        results = await this.searchService.searchHashtags(
          query,
          Math.min(100, Math.max(1, limit)),
        );
        break;
      default:
        results = await this.searchService.searchAll(
          query,
          Math.max(1, page),
          Math.min(100, Math.max(1, limit)),
        );
    }

    return {
      success: true,
      message: 'Search results',
      data: results,
    };
  }
}
