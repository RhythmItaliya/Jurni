import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminUsersService } from '@/admin/services/admin-users.service';
import { UpdateUserDto } from '@/admin/dto';
import { BaseResponseDto, createSuccessResponse } from '@/lib/response.dto';
import { AdminJwtAuthGuard } from '@/admin/guards';

@ApiTags('Admin Users Management')
@Controller('admin/users')
@UseGuards(AdminJwtAuthGuard)
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  /**
   * Get all users
   * Endpoint: GET /admin/users/list
   * @returns List of all users with complete information
   */
  @Get('list')
  @ApiOperation({ summary: 'Get all users with complete information' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Admin JWT token required',
  })
  async getAllUsers(): Promise<BaseResponseDto> {
    try {
      const users = await this.adminUsersService.getAllUsers();
      return createSuccessResponse('Users retrieved successfully', users);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get user by UUID
   * Endpoint: GET /admin/users/:uuid
   * @param uuid - User UUID
   * @returns Complete user information
   */
  @Get(':uuid')
  @ApiOperation({ summary: 'Get user by UUID with complete information' })
  @ApiParam({
    name: 'uuid',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Admin JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserByUuid(@Param('uuid') uuid: string): Promise<BaseResponseDto> {
    try {
      if (!uuid || uuid.trim().length === 0) {
        throw new BadRequestException('UUID is required');
      }
      const user = await this.adminUsersService.getUserByUuid(uuid);
      return createSuccessResponse('User retrieved successfully', user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update user (suspend/unsuspend/activate/deactivate)
   * Endpoint: PATCH /admin/users/:uuid
   * @param uuid - User UUID
   * @param updateDto - Update data (isSuspended, isActive)
   * @returns Updated user information
   */
  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user (suspend/unsuspend/activate/deactivate)',
  })
  @ApiParam({
    name: 'uuid',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Admin JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateUser(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateUserDto,
  ): Promise<BaseResponseDto> {
    try {
      if (!uuid || uuid.trim().length === 0) {
        throw new BadRequestException('UUID is required');
      }
      const user = await this.adminUsersService.updateUser(uuid, updateDto);
      return createSuccessResponse('User updated successfully', user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Delete user
   * Endpoint: DELETE /admin/users/:uuid
   * @param uuid - User UUID
   * @returns Deletion confirmation
   */
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'uuid',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Admin JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteUser(@Param('uuid') uuid: string): Promise<BaseResponseDto> {
    try {
      if (!uuid || uuid.trim().length === 0) {
        throw new BadRequestException('UUID is required');
      }
      const result = await this.adminUsersService.deleteUser(uuid);
      return createSuccessResponse(result.message, result);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
