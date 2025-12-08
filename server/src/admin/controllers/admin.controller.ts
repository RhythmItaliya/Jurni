import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminAuthService, AdminService } from '@/admin/services';
import {
  AdminLoginDto,
  AdminRegisterDto,
  UpdateAdminDto,
  ChangeAdminPasswordDto,
} from '@/admin/dto';
import { BaseResponseDto } from '@/lib/response.dto';
import { createSuccessResponse } from '@/lib/response.dto';
import { AdminJwtAuthGuard } from '@/admin/guards';

@ApiTags('Admin Authentication')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(
    private adminAuthService: AdminAuthService,
    private adminService: AdminService,
  ) {}

  /**
   * Admin login
   * Endpoint: POST /admin/auth/login
   * @param loginDto - Login credentials
   * @returns Access token and admin data
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: AdminLoginDto): Promise<BaseResponseDto> {
    return this.adminAuthService.login(loginDto);
  }

  /**
   * Register new admin (super_admin only)
   * Endpoint: POST /admin/auth/register
   * @param registerDto - Registration data
   * @returns Created admin data
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new admin (super_admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Admin already exists',
  })
  async register(
    @Body() registerDto: AdminRegisterDto,
  ): Promise<BaseResponseDto> {
    return this.adminAuthService.register(registerDto);
  }
}

@ApiTags('Admin Management')
@Controller('admin')
@UseGuards(AdminJwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  /**
   * Get all admins
   * Endpoint: GET /admin
   * @returns List of all admins
   */
  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({
    status: 200,
    description: 'Admins retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Admin JWT token required',
  })
  async getAllAdmins(): Promise<BaseResponseDto> {
    const admins = await this.adminService.getAllAdmins();
    return createSuccessResponse('Admins retrieved successfully', { admins });
  }

  /**
   * Get admin by UUID
   * Endpoint: GET /admin/:uuid
   * @param uuid - Admin UUID
   * @returns Admin data
   */
  @Get(':uuid')
  @ApiOperation({ summary: 'Get admin by UUID' })
  @ApiResponse({
    status: 200,
    description: 'Admin retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  async getAdminByUuid(@Param('uuid') uuid: string): Promise<BaseResponseDto> {
    const admin = await this.adminService.findByUuid(uuid);
    const { password, ...adminData } = admin.toObject();
    return createSuccessResponse('Admin retrieved successfully', {
      admin: adminData,
    });
  }

  /**
   * Update admin
   * Endpoint: PATCH /admin/:uuid
   * @param uuid - Admin UUID
   * @param updateDto - Update data
   * @returns Updated admin data
   */
  @Patch(':uuid')
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({
    status: 200,
    description: 'Admin updated successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  async updateAdmin(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateAdminDto,
  ): Promise<BaseResponseDto> {
    const admin = await this.adminService.updateAdmin(uuid, updateDto);
    const { password, ...adminData } = admin.toObject();
    return createSuccessResponse('Admin updated successfully', {
      admin: adminData,
    });
  }

  /**
   * Change admin password
   * Endpoint: PATCH /admin/:uuid/password
   * @param uuid - Admin UUID
   * @param changePasswordDto - Password change data
   * @returns Success message
   */
  @Patch(':uuid/password')
  @ApiOperation({ summary: 'Change admin password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Current password is incorrect',
  })
  async changePassword(
    @Param('uuid') uuid: string,
    @Body() changePasswordDto: ChangeAdminPasswordDto,
  ): Promise<BaseResponseDto> {
    await this.adminService.changePassword(uuid, changePasswordDto);
    return createSuccessResponse('Password changed successfully', null);
  }

  /**
   * Delete admin
   * Endpoint: DELETE /admin/:uuid
   * @param uuid - Admin UUID
   * @returns Success message
   */
  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({
    status: 200,
    description: 'Admin deleted successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  async deleteAdmin(@Param('uuid') uuid: string): Promise<BaseResponseDto> {
    await this.adminService.deleteAdmin(uuid);
    return createSuccessResponse('Admin deleted successfully', null);
  }
}
