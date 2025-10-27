import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '@/users/services/user.service';
import { UserDocument } from '@/users/models/user.schema';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UpdateUserDto, UserResponseDto } from '@/users/dto/user.dto';
import { BaseResponseDto } from '@/lib/response.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all users',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  findAll(): Promise<BaseResponseDto> {
    return this.userService.findAll().then((users) => ({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  @ApiOperation({ summary: 'Get user by UUID' })
  @ApiParam({
    name: 'uuid',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns user details',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findOne(@Param('uuid') uuid: string): Promise<BaseResponseDto> {
    return this.userService
      .findByUuid(uuid)
      .then((user) => ({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      }))
      .catch((error) => ({
        success: false,
        message: 'User not found',
        error: error.message,
      }));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':uuid')
  @ApiOperation({ summary: 'Update user by UUID' })
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
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseDto> {
    return this.userService
      .update(uuid, updateUserDto)
      .then((user) => ({
        success: true,
        message: 'User updated successfully',
        data: user,
      }))
      .catch((error) => ({
        success: false,
        message: 'Failed to update user',
        error: error.message,
      }));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete user by UUID' })
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
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  remove(@Param('uuid') uuid: string): Promise<BaseResponseDto> {
    return this.userService
      .remove(uuid)
      .then((user) => ({
        success: true,
        message: 'User deleted successfully',
        data: user,
      }))
      .catch((error) => ({
        success: false,
        message: 'Failed to delete user',
        error: error.message,
      }));
  }
}
