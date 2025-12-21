import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminReportsService } from '../services/admin-reports.service';
import { AdminJwtAuthGuard } from '../guards/admin-jwt-auth.guard';
import { BaseResponseDto, createSuccessResponse } from '@/lib/response.dto';

@ApiTags('Admin - Reports')
@Controller('admin/reports')
@UseGuards(AdminJwtAuthGuard)
@ApiBearerAuth()
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @Get('stats')
  async getStats(): Promise<BaseResponseDto> {
    try {
      const stats = await this.adminReportsService.getReportsStats();
      return createSuccessResponse('Statistics fetched successfully', {
        stats,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('list')
  async getAllReports(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: 'post' | 'user',
    @Query('status') status?: string,
  ): Promise<BaseResponseDto> {
    const result = await this.adminReportsService.getAllReports(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      type,
      status,
    );

    return createSuccessResponse('Reports fetched successfully', result);
  }

  @Get(':uuid')
  async getReportById(@Param('uuid') uuid: string): Promise<BaseResponseDto> {
    try {
      const result = await this.adminReportsService.getReportById(uuid);
      return createSuccessResponse('Report fetched successfully', result);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':uuid/status')
  async updateReportStatus(
    @Param('uuid') uuid: string,
    @Body('status') status: 'pending' | 'reviewed' | 'resolved' | 'dismissed',
  ): Promise<BaseResponseDto> {
    try {
      const result = await this.adminReportsService.updateReportStatus(
        uuid,
        status,
      );
      return createSuccessResponse(
        'Report status updated successfully',
        result,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':uuid')
  async deleteReport(@Param('uuid') uuid: string): Promise<BaseResponseDto> {
    try {
      const result = await this.adminReportsService.deleteReport(uuid);
      return createSuccessResponse('Report deleted successfully', result);
    } catch (error) {
      throw error;
    }
  }
}
