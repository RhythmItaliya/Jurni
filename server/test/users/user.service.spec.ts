import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from '../../src/users/user.service';
import { User, UserDocument } from '../../src/users/user.schema';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { TEST_CONFIG } from '../test-config';
import { usersData } from '../data';

/**
 * Unit tests for UserService
 * Tests user registration, login, and CRUD operations
 * Uses mocked Mongoose model to isolate service logic
 */
describe('UserService', () => {
  let service: UserService;
  let mockUserModel: any;

  /**
   * Mock user object for testing
   * Uses data from JSON test files to ensure consistency
   */
  const mockUser = {
    uuid: usersData.mockUsers.user1.uuid,           // Use predefined UUID
    username: usersData.mockUsers.user1.username,   // Use predefined username
    email: usersData.mockUsers.user1.email,         // Use predefined email
    password: usersData.mockUsers.user1.password,   // Use predefined password
    isActive: usersData.mockUsers.user1.isActive,   // Use predefined active status
    save: jest.fn(),                               // Mock save method
    toObject: jest.fn(() => ({                     // Mock toObject method
      uuid: usersData.mockUsers.user1.uuid,
      username: usersData.mockUsers.user1.username,
      email: usersData.mockUsers.user1.email,
      password: usersData.mockUsers.user1.password,
      isActive: usersData.mockUsers.user1.isActive,
    })),
  };

  /**
   * Set up test environment before each test
   * Creates mock Mongoose model and injects it into UserService
   */
  beforeEach(async () => {
    // Create a mock constructor function that returns mockUser when called with 'new'
    const MockUserModel = jest.fn().mockImplementation(() => mockUser) as any;
    
    // Add static methods to the constructor
    MockUserModel.findOne = jest.fn();
    MockUserModel.find = jest.fn();
    MockUserModel.findOneAndUpdate = jest.fn();
    MockUserModel.findOneAndDelete = jest.fn();
    MockUserModel.select = jest.fn();
    MockUserModel.exec = jest.fn();

    mockUserModel = MockUserModel;

    // Create testing module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  /**
   * Basic service instantiation test
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Test suite for user registration functionality
   * Covers both successful registration and conflict scenarios
   */
  describe('register', () => {
    /**
     * Test successful user registration
     * Verifies that valid user data results in successful account creation
     */
    it('should register a new user successfully', async () => {
      // Prepare registration data using predefined test data
      const registerDto = {
        username: usersData.validUser.username,
        email: usersData.validUser.email,
        password: usersData.validUser.password,
      };

      // Mock that no existing user is found (allowing registration)
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Mock successful user save
      mockUser.save.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      // Verify the service returns the created user
      expect(result).toBe(mockUser);
      
      // Verify the service checked for existing users with correct criteria
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email: registerDto.email }, { username: registerDto.username }],
      });
    });

    /**
     * Test registration failure when user with same email already exists
     * Verifies that duplicate emails are properly rejected
     */
    it('should throw ConflictException if user with same email already exists', async () => {
      // Prepare registration data using predefined test data
      const registerDto = {
        username: usersData.validUser2.username,
        email: usersData.validUser.email, // Use the same email as validUser
        password: usersData.validUser2.password,
      };

      // Mock that an existing user with the same email is found
      const existingUser = { ...mockUser, email: registerDto.email };
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingUser),
      });

      // Verify that the service throws the correct exception
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    /**
     * Test registration failure when user with same username already exists
     * Verifies that duplicate usernames are properly rejected
     */
    it('should throw ConflictException if user with same username already exists', async () => {
      // Prepare registration data using predefined test data
      const registerDto = {
        username: usersData.validUser.username, // Use the same username as validUser
        email: usersData.validUser2.email,
        password: usersData.validUser2.password,
      };

      // Mock that an existing user with the same username is found
      const existingUser = { ...mockUser, username: registerDto.username };
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingUser),
      });

      // Verify that the service throws the correct exception
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    /**
     * Test registration failure when user already exists (general case)
     * Verifies that duplicate users are properly rejected
     */
    it('should throw ConflictException if user already exists', async () => {
      // Prepare registration data using predefined test data
      const registerDto = {
        username: usersData.validUser2.username,
        email: usersData.validUser2.email,
        password: usersData.validUser2.password,
      };

      // Mock that an existing user is found (preventing registration)
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      // Verify that the service throws the correct exception
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  /**
   * Test suite for user login functionality
   * Covers successful authentication and invalid credential scenarios
   */
  describe('login', () => {
    /**
     * Test successful user login
     * Verifies that valid credentials result in successful authentication
     */
    it('should login user successfully with valid credentials', async () => {
      // Prepare login data using predefined test data
      const loginDto = {
        email: usersData.validUser.email,
        password: usersData.validUser.password,
      };

      // Hash the password to simulate stored hashed password
      const hashedPassword = await bcrypt.hash(usersData.validUser.password, 10);
      const userWithHashedPassword = { ...mockUser, password: hashedPassword };

      // Mock successful user lookup
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userWithHashedPassword),
      });

      const result = await service.login(loginDto);

      // Verify the service returns the authenticated user
      expect(result).toBe(userWithHashedPassword);
    });

    /**
     * Test login failure with non-existent email
     * Verifies that invalid credentials are properly rejected
     */
    it('should throw UnauthorizedException if user not found', async () => {
      // Prepare login data using predefined test data
      const loginDto = {
        email: usersData.loginCredentials.invalidEmail.email,
        password: usersData.loginCredentials.invalidEmail.password,
      };

      // Mock that no user is found
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Verify that the service throws the correct exception
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  /**
   * Test suite for finding users by UUID
   * Covers successful user lookup and not found scenarios
   */
  describe('findByUuid', () => {
    /**
     * Test successful user lookup by UUID
     * Verifies that valid UUIDs result in successful user retrieval
     */
    it('should find user by UUID successfully', async () => {
      const uuid = usersData.testUuids.valid;

      // Mock successful user lookup
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByUuid(uuid);

      // Verify the service returns the found user
      expect(result).toBe(mockUser);
      
      // Verify the service searched with the correct UUID
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ uuid });
    });

    /**
     * Test user lookup failure with non-existent UUID
     * Verifies that invalid UUIDs result in proper error handling
     */
    it('should throw NotFoundException if user not found', async () => {
      const uuid = usersData.testUuids.invalid;

      // Mock that no user is found
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Verify that the service throws the correct exception
      await expect(service.findByUuid(uuid)).rejects.toThrow('User not found');
    });
  });

  /**
   * Test suite for retrieving all users
   * Verifies that user list retrieval works correctly
   */
  describe('findAll', () => {
    /**
     * Test successful retrieval of all users
     * Verifies that the service returns users without sensitive data
     */
    it('should return all users without passwords', async () => {
      // Prepare mock user data without passwords
      const usersWithoutPasswords = [
        { 
          uuid: usersData.mockUsers.user1.uuid, 
          username: usersData.mockUsers.user1.username, 
          email: usersData.mockUsers.user1.email 
        },
        { 
          uuid: usersData.mockUsers.user2.uuid, 
          username: usersData.mockUsers.user2.username, 
          email: usersData.mockUsers.user2.email 
        },
      ];

      // Mock successful user list retrieval
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(usersWithoutPasswords),
        }),
      });

      const result = await service.findAll();

      // Verify the service returns the expected user list
      expect(result).toEqual(usersWithoutPasswords);
      
      // Verify the service called the find method
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });
});
