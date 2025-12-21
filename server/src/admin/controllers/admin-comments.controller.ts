import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminCommentsService } from '@/admin/services/admin-comments.service';
import { AdminJwtAuthGuard } from '@/admin/guards';
import { BaseResponseDto, createSuccessResponse } from '@/lib/response.dto';

@ApiTags('Admin - Comments')
@Controller('admin/comments')
@UseGuards(AdminJwtAuthGuard)
@ApiBearerAuth()
export class AdminCommentsController {
  constructor(private adminCommentsService: AdminCommentsService) {}

  @Get('stats')
  async getStats(): Promise<BaseResponseDto> {
    try {
      const stats = await this.adminCommentsService.getStats();
      return createSuccessResponse('Statistics fetched successfully', {
        stats,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('list')
  async getAllComments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<BaseResponseDto> {
    const result = await this.adminCommentsService.getAllComments({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 12,
    });

    return createSuccessResponse('Comments fetched successfully', result);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: string): Promise<BaseResponseDto> {
    try {
      const result = await this.adminCommentsService.deleteComment(id);
      return createSuccessResponse('Comment deleted successfully', result);
    } catch (error) {
      throw error;
    }
  }
}
