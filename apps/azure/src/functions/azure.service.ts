import { Injectable } from '@nestjs/common';

@Injectable()
export class AzureService {
  constructor() {
    // Initialize any required dependencies or configurations here
  }

  async testFunction() {
    // This is a test function to verify that the service is working correctly
    return { message: 'Azure service is working!' };
  }
}
