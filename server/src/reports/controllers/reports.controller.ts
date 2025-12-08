import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';
import { CreateReportDto, UpdateReportDto } from '../dto/report.dto';
import { Report } from '../models/report.model';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminJwtAuthGuard } from '../../admin/guards/admin-jwt-auth.guard';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({
    status: 201,
    description: 'Report created successfully',
    type: Report,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createReportDto: CreateReportDto,
    @Request() req,
  ): Promise<Report> {
    const reporterId = req.user._id || req.user.id || req.user.userId;
    return this.reportsService.create(createReportDto, reporterId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reports (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
    type: [Report],
  })
  async findAll(): Promise<Report[]> {
    return this.reportsService.findAll();
  }

  @Get('type/:type')
  @UseGuards(JwtAuthGuard, AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reports by type (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
    type: [Report],
  })
  async findByType(@Param('type') type: 'post' | 'user'): Promise<Report[]> {
    return this.reportsService.findByType(type);
  }

  @Get('status/:status')
  @UseGuards(JwtAuthGuard, AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reports by status (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
    type: [Report],
  })
  async findByStatus(@Param('status') status: string): Promise<Report[]> {
    return this.reportsService.findByStatus(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific report by ID (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Report retrieved successfully',
    type: Report,
  })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async findOne(@Param('id') id: string): Promise<Report> {
    return this.reportsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a report (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Report updated successfully',
    type: Report,
  })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
    @Request() req,
  ): Promise<Report> {
    const adminId = req.user._id || req.user.id || req.user.userId;
    return this.reportsService.update(id, updateReportDto, adminId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a report (admin only)' })
  @ApiResponse({ status: 200, description: 'Report deleted successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.reportsService.remove(id);
  }

  @Get('reported/:reportedId')
  @UseGuards(JwtAuthGuard, AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get reports for a specific reported item (admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
    type: [Report],
  })
  async getReportsByReportedId(
    @Param('reportedId') reportedId: string,
  ): Promise<Report[]> {
    return this.reportsService.getReportsByReportedId(reportedId);
  }

  @Get('reporter/:reporterId')
  @UseGuards(JwtAuthGuard, AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reports by a specific reporter (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
    type: [Report],
  })
  async getReportsByReporterId(
    @Param('reporterId') reporterId: string,
  ): Promise<Report[]> {
    return this.reportsService.getReportsByReporterId(reporterId);
  }
}
