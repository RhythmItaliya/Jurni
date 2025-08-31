import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { usersData, authData } from '../data';

/**
 * Unit tests for AuthController
 * Tests HTTP endpoints for authentication: registration and login
 * Uses mocked AuthService to isolate controller logic
 */
describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  /**
   * Set up test environment before each test
   * Creates mock AuthService and injects it into AuthController
   */
  beforeEach(async () => {
    // Create mock implementation for AuthService
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    // Create testing module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  /**
   * Basic controller instantiation test
   */
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Test suite for user registration endpoint
   * Covers both successful registration and error scenarios
   */
  describe('register', () => {
    /**
     * Test successful user registration
     * Verifies that valid registration data results in successful response
     */
    it('should register user successfully with valid data', async () => {
      // Prepare registration data using predefined test data
      const registerDto = {
        username: usersData.validUser.username,
        email: usersData.validUser.email,
        password: usersData.validUser.password,
      };
      const mockResponse = {
        accessToken: authData.jwtData.accessToken,
        user: {
          uuid: usersData.validUser.uuid,
          username: registerDto.username,
          email: registerDto.email,
          isActive: usersData.validUser.isActive,
          createdAt: usersData.validUser.createdAt,
          updatedAt: usersData.validUser.updatedAt,
        },
      };

      // Mock auth service to return successful response
      jest.spyOn(authService, 'register').mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);

      // Verify the controller returns the expected response
      expect(result).toEqual(mockResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    /**
     * Test registration failure when user already exists
     * Ensures that duplicate user errors are properly handled
     */
    it('should handle ConflictException when user already exists', async () => {
      // Prepare registration data using predefined test data
      const registerDto = {
        username: usersData.validUser2.username,
        email: usersData.validUser2.email,
        password: usersData.validUser2.password,
      };

      // Mock auth service to throw ConflictException
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(
          new ConflictException(
            'User with this email or username already exists',
          ),
        );

      // Verify that the controller propagates the exception
      await expect(controller.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    /**
     * Test registration failure with validation errors
     * Ensures that invalid data results in proper error handling
     */
    it('should handle validation errors from auth service', async () => {
      // Prepare registration data using predefined test data
      const registerDto = {
        username: usersData.validUser.username,
        email: usersData.validUser.email,
        password: usersData.validUser.password,
      };

      // Mock auth service to throw a generic error
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new Error('Validation failed'));

      // Verify that the controller propagates the error
      await expect(controller.register(registerDto)).rejects.toThrow(Error);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  /**
   * Test suite for user login endpoint
   * Covers both successful login and error scenarios
   */
  describe('login', () => {
    /**
     * Test successful user login
     * Verifies that valid credentials result in successful authentication
     */
    it('should login user successfully with valid credentials', async () => {
      // Prepare test data using predefined test data
      const loginDto = {
        email: usersData.validUser.email,
        password: usersData.validUser.password,
      };
      const mockResponse = {
        accessToken: authData.jwtData.accessToken,
        user: {
          uuid: usersData.validUser.uuid,
          username: usersData.validUser.username,
          email: loginDto.email,
          isActive: usersData.validUser.isActive,
          createdAt: usersData.validUser.createdAt,
          updatedAt: usersData.validUser.updatedAt,
        },
      };

      // Mock auth service to return successful response
      jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      // Verify the controller returns the expected response
      expect(result).toEqual(mockResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    /**
     * Test login failure with invalid credentials
     * Ensures that invalid credentials result in proper error handling
     */
    it('should handle UnauthorizedException with invalid credentials', async () => {
      // Prepare test data using predefined test data
      const loginDto = {
        email: usersData.loginCredentials.invalidEmail.email,
        password: usersData.loginCredentials.invalidEmail.password,
      };

      // Mock auth service to throw UnauthorizedException
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      // Verify that the controller propagates the exception
      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    /**
     * Test login failure with non-existent user
     * Ensures that non-existent users are properly handled
     */
    it('should handle UnauthorizedException when user not found', async () => {
      // Prepare test data using predefined test data
      const loginDto = {
        email: usersData.loginCredentials.invalidEmail.email,
        password: usersData.loginCredentials.invalidEmail.password,
      };

      // Mock auth service to throw UnauthorizedException
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('User not found'));

      // Verify that the controller propagates the exception
      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    /**
     * Test login failure with general authentication errors
     * Ensures that other authentication errors are properly handled
     */
    it('should handle general authentication errors', async () => {
      // Prepare test data using predefined test data
      const loginDto = {
        email: usersData.validUser.email,
        password: usersData.validUser.password,
      };

      // Mock auth service to throw a generic error
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error('Authentication failed'));

      // Verify that the controller propagates the error
      await expect(controller.login(loginDto)).rejects.toThrow(Error);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  /**
   * Test suite for error handling
   * Ensures that various error types are properly handled
   */
  describe('error handling', () => {
    /**
     * Test handling of unexpected errors
     * Verifies that unexpected errors don't crash the controller
     */
    it('should handle unexpected errors gracefully', async () => {
      // Prepare test data using predefined test data
      const registerDto = {
        username: usersData.validUser.username,
        email: usersData.validUser.email,
        password: usersData.validUser.password,
      };

      // Mock auth service to throw an unexpected error
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new TypeError('Unexpected error'));

      // Verify that the controller propagates the error
      await expect(controller.register(registerDto)).rejects.toThrow(TypeError);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    /**
     * Test handling of null/undefined responses
     * Ensures that null responses are properly handled
     */
    it('should handle null responses from auth service', async () => {
      // Prepare test data using predefined test data
      const loginDto = {
        email: usersData.validUser.email,
        password: usersData.validUser.password,
      };

      // Mock auth service to return null (should not happen in normal flow)
      jest.spyOn(authService, 'login').mockResolvedValue(null as any);

      const result = await controller.login(loginDto);

      // Verify the controller returns null
      expect(result).toBeNull();
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
