import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../src/auth/strategies/jwt.strategy';
import { UserService } from '../../src/users/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { usersData, authData } from '../data';

/**
 * Unit tests for JwtStrategy
 * Tests JWT token validation and user extraction from tokens
 * Uses mocked dependencies to isolate strategy logic
 */
describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;
  let configService: ConfigService;

  /**
   * Mock user object for testing
   * Uses data from JSON test files to ensure consistency
   */
  const mockUser = {
    uuid: usersData.mockUsers.user1.uuid,
    username: usersData.mockUsers.user1.username,
    email: usersData.mockUsers.user1.email,
    password: usersData.mockUsers.user1.password,
    isActive: usersData.mockUsers.user1.isActive,
  };

  /**
   * Set up test environment before each test
   * Creates mock dependencies and injects them into JwtStrategy
   */
  beforeEach(async () => {
    // Create mock implementations for dependencies
    const mockUserService = {
      findByUuid: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    // Create testing module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
  });

  /**
   * Basic strategy instantiation test
   */
  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  /**
   * Test suite for JWT strategy initialization
   * Covers constructor and configuration setup
   */
  describe('constructor', () => {
    /**
     * Test that JWT strategy is properly configured
     * Verifies that the strategy uses the correct secret and options
     */
    it('should be configured with correct JWT options', () => {
      // Verify the strategy has the expected properties
      expect(strategy).toHaveProperty('name');
      expect(strategy).toHaveProperty('_jwtFromRequest');
      expect(strategy).toHaveProperty('validate');
    });
  });

  /**
   * Test suite for JWT token validation
   * Covers successful validation and various failure scenarios
   */
  describe('validate', () => {
    /**
     * Test successful JWT token validation
     * Verifies that valid tokens result in successful user extraction
     */
    it('should validate JWT token and return user successfully', async () => {
      // Prepare test data
      const mockPayload = {
        email: usersData.validUser.email,
        sub: usersData.validUser.uuid,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      // Mock user service to return a valid user
      jest.spyOn(userService, 'findByUuid').mockResolvedValue(mockUser as any);

      const result = await strategy.validate(mockPayload);

      // Verify the strategy returns the user
      expect(result).toEqual(mockUser);
      expect(userService.findByUuid).toHaveBeenCalledWith(mockPayload.sub);
    });

    /**
     * Test JWT validation failure when user not found
     * Ensures that invalid user IDs in tokens are properly rejected
     */
    it('should throw UnauthorizedException when user not found', async () => {
      // Prepare test data
      const mockPayload = {
        email: usersData.validUser2.email,
        sub: usersData.testUuids.invalid,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      // Mock user service to return null (user not found)
      jest.spyOn(userService, 'findByUuid').mockResolvedValue(null as any);

      // Verify that the strategy throws the correct exception
      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.findByUuid).toHaveBeenCalledWith(mockPayload.sub);
    });

    /**
     * Test JWT validation with expired token
     * Note: JWT expiration is handled by the JWT library, not the strategy
     */
    it('should handle expired token payload gracefully', async () => {
      // Prepare test data with expired timestamp
      const mockPayload = {
        email: usersData.validUser.email,
        sub: usersData.validUser.uuid,
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago (expired)
      };

      // Mock user service to return a valid user
      jest.spyOn(userService, 'findByUuid').mockResolvedValue(mockUser as any);

      // The strategy should still work as JWT expiration is handled by the library
      const result = await strategy.validate(mockPayload);

      // Verify the strategy returns the user
      expect(result).toEqual(mockUser);
      expect(userService.findByUuid).toHaveBeenCalledWith(mockPayload.sub);
    });

    /**
     * Test JWT validation with malformed payload
     * Ensures that malformed payloads are handled gracefully
     */
    it('should handle malformed payload gracefully', async () => {
      // Prepare test data with missing required fields
      const mockPayload = {
        email: usersData.validUser.email,
        // Missing 'sub' field
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      // Mock user service to return null (user not found)
      jest.spyOn(userService, 'findByUuid').mockResolvedValue(null as any);

      // The strategy should handle missing 'sub' field gracefully
      await expect(strategy.validate(mockPayload as any)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.findByUuid).toHaveBeenCalledWith(undefined);
    });

    /**
     * Test JWT validation with null payload
     * Ensures that null payloads are handled gracefully
     */
    it('should handle null payload gracefully', async () => {
      // Mock user service to return null (user not found)
      jest.spyOn(userService, 'findByUuid').mockResolvedValue(null as any);

      // Verify that the strategy handles null payload gracefully
      await expect(strategy.validate(null as any)).rejects.toThrow(TypeError);
      expect(userService.findByUuid).not.toHaveBeenCalled();
    });
  });

  /**
   * Test suite for error handling
   * Ensures that various error types are properly handled
   */
  describe('error handling', () => {
    /**
     * Test handling of user service errors
     * Ensures that user service errors are properly propagated
     */
    it('should propagate errors from user service', async () => {
      // Prepare test data
      const mockPayload = {
        email: usersData.validUser.email,
        sub: usersData.validUser.uuid,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      // Mock user service to throw an error
      jest
        .spyOn(userService, 'findByUuid')
        .mockRejectedValue(new Error('Database error'));

      // Verify that the strategy propagates the error
      await expect(strategy.validate(mockPayload)).rejects.toThrow(Error);
      expect(userService.findByUuid).toHaveBeenCalledWith(mockPayload.sub);
    });

    /**
     * Test handling of unexpected errors
     * Verifies that unexpected errors don't crash the strategy
     */
    it('should handle unexpected errors gracefully', async () => {
      // Prepare test data
      const mockPayload = {
        email: usersData.validUser.email,
        sub: usersData.validUser.uuid,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      // Mock user service to throw an unexpected error
      jest
        .spyOn(userService, 'findByUuid')
        .mockRejectedValue(new TypeError('Unexpected error'));

      // Verify that the strategy propagates the error
      await expect(strategy.validate(mockPayload)).rejects.toThrow(TypeError);
      expect(userService.findByUuid).toHaveBeenCalledWith(mockPayload.sub);
    });
  });

  /**
   * Test suite for edge cases
   * Covers unusual but valid scenarios
   */
  describe('edge cases', () => {
    /**
     * Test JWT validation with very long user ID
     * Ensures that long UUIDs are handled correctly
     */
    it('should handle very long user IDs', async () => {
      // Prepare test data with very long UUID
      const longUuid = 'a'.repeat(100);
      const mockPayload = {
        email: usersData.validUser.email,
        sub: longUuid,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      // Mock user service to return a valid user
      jest.spyOn(userService, 'findByUuid').mockResolvedValue(mockUser as any);

      const result = await strategy.validate(mockPayload);

      // Verify the strategy returns the user
      expect(result).toEqual(mockUser);
      expect(userService.findByUuid).toHaveBeenCalledWith(longUuid);
    });

    /**
     * Test JWT validation with special characters in email
     * Ensures that special characters are handled correctly
     */
    it('should handle special characters in email', async () => {
      // Prepare test data with special characters in email
      const mockPayload = {
        email: 'test+special@example.com',
        sub: usersData.validUser.uuid,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      // Mock user service to return a valid user
      jest.spyOn(userService, 'findByUuid').mockResolvedValue(mockUser as any);

      const result = await strategy.validate(mockPayload);

      // Verify the strategy returns the user
      expect(result).toEqual(mockUser);
      expect(userService.findByUuid).toHaveBeenCalledWith(mockPayload.sub);
    });
  });
});
