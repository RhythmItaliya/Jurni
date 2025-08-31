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
    createdAt: new Date(usersData.validUser.createdAt),
    updatedAt: new Date(usersData.validUser.updatedAt),
    save: jest.fn().mockResolvedValue(usersData.validUser),
    toObject: jest.fn(() => ({
      ...usersData.validUser,
      createdAt: new Date(usersData.validUser.createdAt),
      updatedAt: new Date(usersData.validUser.updatedAt),
    })),
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
      findByUsernameOrEmail: jest.fn(),
      comparePassword: jest.fn(),
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
     * Test successful user validation with email
     * Verifies that valid email credentials result in successful authentication
     */
    it('should validate user successfully with correct email credentials', async () => {
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

      // Mock findByUsernameOrEmail to return user
      jest
        .spyOn(userService, 'findByUsernameOrEmail')
        .mockResolvedValue(userWithHashedPassword as any);
      jest.spyOn(userService, 'comparePassword').mockResolvedValue(true);

      // Execute validation
      const result = await service.validateUser(email, password);

      // Verify result
      expect(result).toBeDefined();
      expect(result.email).toBe(email);
      expect(result.username).toBe(usersData.validUser.username);
      expect(result.password).toBeUndefined(); // Password should be removed
      expect(userService.findByUsernameOrEmail).toHaveBeenCalledWith(email);
      expect(userService.comparePassword).toHaveBeenCalledWith(
        password,
        hashedPassword,
      );
    });

    /**
     * Test successful user validation with username
     * Verifies that valid username credentials result in successful authentication
     */
    it('should validate user successfully with correct username credentials', async () => {
      // Prepare test data
      const username = usersData.validUser.username;
      const password = usersData.validUser.password;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Mock user service to return a user with hashed password
      const userWithHashedPassword = {
        ...mockUser,
        username,
        password: hashedPassword,
      };

      // Mock findByUsernameOrEmail to return user
      jest
        .spyOn(userService, 'findByUsernameOrEmail')
        .mockResolvedValue(userWithHashedPassword as any);
      jest.spyOn(userService, 'comparePassword').mockResolvedValue(true);

      // Execute validation
      const result = await service.validateUser(username, password);

      // Verify result
      expect(result).toBeDefined();
      expect(result.username).toBe(username);
      expect(result.email).toBe(usersData.validUser.email);
      expect(result.password).toBeUndefined(); // Password should be removed
      expect(userService.findByUsernameOrEmail).toHaveBeenCalledWith(username);
      expect(userService.comparePassword).toHaveBeenCalledWith(
        password,
        hashedPassword,
      );
    });

    /**
     * Test user validation failure with incorrect password
     * Verifies that invalid password results in authentication failure
     */
    it('should fail validation with incorrect password', async () => {
      // Prepare test data
      const email = usersData.validUser.email;
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await bcrypt.hash(
        usersData.validUser.password,
        10,
      );

      // Mock user service to return a user with hashed password
      const userWithHashedPassword = {
        ...mockUser,
        email,
        password: hashedPassword,
      };

      // Mock findByUsernameOrEmail to return user but comparePassword to return false
      jest
        .spyOn(userService, 'findByUsernameOrEmail')
        .mockResolvedValue(userWithHashedPassword as any);
      jest.spyOn(userService, 'comparePassword').mockResolvedValue(false);

      // Execute validation
      const result = await service.validateUser(email, wrongPassword);

      // Verify result
      expect(result).toBeNull();
      expect(userService.findByUsernameOrEmail).toHaveBeenCalledWith(email);
      expect(userService.comparePassword).toHaveBeenCalledWith(
        wrongPassword,
        hashedPassword,
      );
    });

    /**
     * Test user validation failure with non-existent user
     * Verifies that non-existent user results in authentication failure
     */
    it('should fail validation with non-existent user', async () => {
      // Prepare test data
      const nonExistentEmail = 'nonexistent@example.com';
      const password = usersData.validUser.password;

      // Mock findByUsernameOrEmail to return null
      jest.spyOn(userService, 'findByUsernameOrEmail').mockResolvedValue(null);

      // Execute validation
      const result = await service.validateUser(nonExistentEmail, password);

      // Verify result
      expect(result).toBeNull();
      expect(userService.findByUsernameOrEmail).toHaveBeenCalledWith(
        nonExistentEmail,
      );
      expect(userService.comparePassword).not.toHaveBeenCalled();
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
        usernameOrEmail: usersData.validUser.email,
        password: usersData.validUser.password,
      };
      const mockUserObj = {
        uuid: usersData.validUser.uuid,
        username: usersData.validUser.username,
        email: userDto.usernameOrEmail,
        password: 'hashedpassword',
        isActive: usersData.validUser.isActive,
        createdAt: new Date(usersData.validUser.createdAt),
        updatedAt: new Date(usersData.validUser.updatedAt),
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
      expect(result.user.email).toBe(userDto.usernameOrEmail);
      expect(result.user.uuid).toBe(mockUserObj.uuid);
      expect(service.validateUser).toHaveBeenCalledWith(
        userDto.usernameOrEmail,
        userDto.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: userDto.usernameOrEmail,
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
        usernameOrEmail:
          authData.invalidCredentials.invalidEmail.usernameOrEmail,
        password: authData.invalidCredentials.invalidEmail.password,
      };

      // Mock user validation to return null (invalid credentials)
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      // Verify that the service throws the correct exception
      await expect(service.login(userDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.validateUser).toHaveBeenCalledWith(
        userDto.usernameOrEmail,
        userDto.password,
      );
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
        createdAt: new Date(usersData.validUser.createdAt),
        updatedAt: new Date(usersData.validUser.updatedAt),
      };

      // Mock user service to successfully register the user
      jest
        .spyOn(userService, 'register')
        .mockResolvedValue(mockRegisteredUser as any);

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
      jest
        .spyOn(userService, 'register')
        .mockRejectedValue(new ConflictException('User already exists'));

      // Verify that the service propagates the exception
      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});
