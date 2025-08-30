import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../src/auth/auth.service';
import { UserService } from '../../src/users/user.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { usersData, authData } from '../data';

/**
 * Unit tests for AuthService
 * Tests user validation, login, registration, and JWT token generation
 * Uses mocked dependencies to isolate service logic
 */
describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  /**
   * Mock user object for testing
   * Uses data from JSON test files to ensure consistency
   */
  const mockUser = {
    uuid: usersData.validUser.uuid,
    username: usersData.validUser.username,
    email: usersData.validUser.email,
    password: usersData.validUser.password,
    isActive: usersData.validUser.isActive,
    save: jest.fn().mockResolvedValue(usersData.validUser),
    toObject: jest.fn(() => usersData.validUser),
  };

  /**
   * Set up test environment before each test
   * Creates mock dependencies and injects them into AuthService
   */
  beforeEach(async () => {
    // Create mock implementations for dependencies
    const mockUserService = {
      findByEmail: jest.fn(),
      register: jest.fn(),
      findByUuid: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    // Create testing module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  /**
   * Basic service instantiation test
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Test suite for user validation functionality
   * Covers credential validation and user lookup
   */
  describe('validateUser', () => {
    /**
     * Test successful user validation
     * Verifies that valid credentials result in successful authentication
     */
    it('should validate user successfully with correct credentials', async () => {
      // Prepare test data
      const email = usersData.validUser.email;
      const password = usersData.validUser.password;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Mock user service to return a user with hashed password
      const userWithHashedPassword = {
        ...mockUser,
        email,
        password: hashedPassword,
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(userWithHashedPassword as any);

      // Use actual bcrypt compare instead of mocking
      const result = await service.validateUser(email, password);

      // Verify the service returns the user without password
      expect(result).toBeDefined();
      expect(result.email).toBe(email);
      expect(result.password).toBeUndefined();
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });

    /**
     * Test user validation failure when user not found
     * Ensures proper error handling for non-existent users
     */
    it('should return null when user not found', async () => {
      const email = usersData.loginCredentials.invalidEmail.email;
      const password = usersData.loginCredentials.invalidEmail.password;

      // Mock user service to return null (user not found)
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      // Verify the service returns null
      expect(result).toBeNull();
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });

    /**
     * Test user validation failure with incorrect password
     * Ensures that wrong passwords are properly rejected
     */
    it('should return null when password is incorrect', async () => {
      const email = usersData.validUser.email;
      const password = usersData.loginCredentials.invalidPassword.password;
      const hashedPassword = await bcrypt.hash(usersData.validUser.password, 10);

      // Mock user service to return a user
      const userWithHashedPassword = {
        ...mockUser,
        email,
        password: hashedPassword,
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(userWithHashedPassword as any);

      // Use actual bcrypt compare instead of mocking
      const result = await service.validateUser(email, password);

      // Verify the service returns null
      expect(result).toBeNull();
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  /**
   * Test suite for user login functionality
   * Covers successful login and various failure scenarios
   */
  describe('login', () => {
    /**
     * Test successful user login
     * Verifies that valid credentials result in successful authentication
     */
    it('should login user successfully with valid credentials', async () => {
      // Prepare test data
      const userDto = {
        email: usersData.validUser.email,
        password: usersData.validUser.password,
      };
      const mockUserObj = {
        uuid: usersData.validUser.uuid,
        username: usersData.validUser.username,
        email: userDto.email,
        password: 'hashedpassword',
        isActive: usersData.validUser.isActive,
      };

      // Mock user validation to return a valid user
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUserObj as any);

      // Mock JWT service to return a token
      const mockToken = authData.jwtData.accessToken;
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.login(userDto);

      // Verify the service returns the expected response structure
      expect(result.accessToken).toBe(mockToken);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userDto.email);
      expect(result.user.uuid).toBe(mockUserObj.uuid);
      expect(service.validateUser).toHaveBeenCalledWith(userDto.email, userDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: userDto.email,
        sub: mockUserObj.uuid,
      });
    });

    /**
     * Test login failure with invalid credentials
     * Ensures that invalid credentials result in proper error handling
     */
    it('should throw UnauthorizedException with invalid credentials', async () => {
      // Prepare test data
      const userDto = {
        email: usersData.loginCredentials.invalidEmail.email,
        password: usersData.loginCredentials.invalidEmail.password,
      };

      // Mock user validation to return null (invalid credentials)
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      // Verify that the service throws the correct exception
      await expect(service.login(userDto)).rejects.toThrow(UnauthorizedException);
      expect(service.validateUser).toHaveBeenCalledWith(userDto.email, userDto.password);
    });
  });

  /**
   * Test suite for user registration functionality
   * Covers successful registration and conflict scenarios
   */
  describe('register', () => {
    /**
     * Test successful user registration
     * Verifies that valid user data results in successful account creation
     */
    it('should register user successfully with valid data', async () => {
      // Prepare test data
      const registerDto = {
        username: usersData.validUser.username,
        email: usersData.validUser.email,
        password: usersData.validUser.password,
      };
      const mockRegisteredUser = {
        uuid: usersData.validUser.uuid,
        username: registerDto.username,
        email: registerDto.email,
        password: 'hashedpassword',
        isActive: usersData.validUser.isActive,
      };

      // Mock user service to successfully register the user
      jest.spyOn(userService, 'register').mockResolvedValue(mockRegisteredUser as any);

      // Mock JWT service to return a token
      const mockToken = authData.jwtData.accessToken;
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.register(registerDto);

      // Verify the service returns the expected response structure
      expect(result.accessToken).toBe(mockToken);
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe(registerDto.username);
      expect(result.user.email).toBe(registerDto.email);
      expect(result.user.uuid).toBe(mockRegisteredUser.uuid);
      expect(userService.register).toHaveBeenCalledWith(registerDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: registerDto.email,
        sub: mockRegisteredUser.uuid,
      });
    });

    /**
     * Test registration failure when user service throws ConflictException
     * Ensures that duplicate user errors are properly propagated
     */
    it('should propagate ConflictException from user service', async () => {
      // Prepare test data
      const registerDto = {
        username: usersData.validUser2.username,
        email: usersData.validUser2.email,
        password: usersData.validUser2.password,
      };

      // Mock user service to throw ConflictException
      jest.spyOn(userService, 'register').mockRejectedValue(new ConflictException('User already exists'));

      // Verify that the service propagates the exception
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(userService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});
