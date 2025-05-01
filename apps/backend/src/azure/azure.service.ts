import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AzureService {
  private readonly azureFunctionUrl: string;

  constructor() {
    // Replace with your Azure Function URL
    this.azureFunctionUrl = process.env.AZURE_FUNCTION_URL || '';
  }

  async updateFunction(functionName: string, payload: any): Promise<any> {
    try {
      // Construct the URL for the Azure Function
      // Ensure the function name is URL-encoded if necessary
      // const encodedFunctionName = encodeURIComponent(functionName);
      const url = `${this.azureFunctionUrl}/${functionName}`;
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error triggering Azure Function:', error.message);
      throw new Error('Failed to trigger Azure Function');
    }
  }
}
