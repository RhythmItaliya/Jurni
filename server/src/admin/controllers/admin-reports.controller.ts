import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminReportsService } from '../services/admin-reports.service';
import { AdminJwtAuthGuard } from '../guards/admin-jwt-auth.guard';

@Controller('admin/reports')
@UseGuards(AdminJwtAuthGuard)
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @Get()
  async getAllReports(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('type') type?: 'post' | 'user',
    @Query('status') status?: string,
  ) {
    return this.adminReportsService.getAllReports(
      parseInt(page),
      parseInt(limit),
      type,
      status,
    );
  }

  @Get('stats')
  async getReportsStats() {
    return this.adminReportsService.getReportsStats();
  }

  @Get(':uuid')
  async getReportById(@Param('uuid') uuid: string) {
    return this.adminReportsService.getReportById(uuid);
  }

  @Patch(':uuid/status')
  async updateReportStatus(
    @Param('uuid') uuid: string,
    @Body('status') status: 'pending' | 'reviewed' | 'resolved' | 'dismissed',
    @Req() req: any,
  ) {
    return this.adminReportsService.updateReportStatus(
      uuid,
      status,
      req.user.sub,
    );
  }

  @Delete(':uuid')
  async deleteReport(@Param('uuid') uuid: string) {
    return this.adminReportsService.deleteReport(uuid);
  }
}
