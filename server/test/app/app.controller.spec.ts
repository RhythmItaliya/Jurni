import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/app/app.controller';
import { AppService } from '../../src/app/app.service';
import { TEST_CONFIG } from '../test-config';
import { appData } from '../data';

/**
 * Unit tests for AppController
 * Tests the root endpoint functionality
 * Uses predefined test data from JSON files for consistency
 */
describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  /**
   * Set up test environment before each test
   * Creates mock AppService and injects it into AppController
   */
  beforeEach(async () => {
    // Create mock implementation for AppService
    const mockAppService = {
      getHello: jest.fn(),
    };

    // Create testing module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  /**
   * Basic controller instantiation test
   */
  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  /**
   * Test suite for root endpoint functionality
   * Covers the main application response
   */
  describe('root', () => {
    /**
     * Test that the root endpoint returns the correct application name
     * Verifies that the controller returns the expected response from the service
     */
    it('should return "Jurni Platform API"', () => {
      // Mock the service to return the expected application name
      const expectedResponse = appData.appName;
      jest.spyOn(appService, 'getHello').mockReturnValue(expectedResponse);

      // Verify the controller returns the expected response
      expect(appController.getHello()).toBe(expectedResponse);
      
      // Verify the service method was called
      expect(appService.getHello).toHaveBeenCalled();
    });
  });
});
