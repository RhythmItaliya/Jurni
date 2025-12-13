import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { SuggestionsService } from '../services/suggestions.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('suggestions')
@UseGuards(JwtAuthGuard)
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  /**
   * Get user suggestions for the current user
   * GET /suggestions/users?limit=10
   */
  @Get('users')
  async getUserSuggestions(
    @Req() req: any,
    @Query('limit') limit: number = 10,
  ) {
    const user = req.user;
    const userId = user.uuid || user.sub || user._id;

    const suggestions = await this.suggestionsService.getUserSuggestions(
      userId,
      Math.min(50, Math.max(1, limit)),
    );

    return {
      success: true,
      message: 'User suggestions',
      data: suggestions,
    };
  }

  /**
   * Get trending hashtags
   * GET /suggestions/hashtags?limit=10
   */
  @Get('hashtags')
  async getTrendingHashtags(@Query('limit') limit: number = 10) {
    const hashtags = await this.suggestionsService.getTrendingHashtags(
      Math.min(50, Math.max(1, limit)),
    );
    return {
      success: true,
      message: 'Trending hashtags',
      data: hashtags,
    };
  }
}
