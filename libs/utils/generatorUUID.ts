import { v4 as uuidv4 } from 'uuid';

// Then replace your existing generateTraceId method with:
interface GenerateTraceIdOptions {
  service?: string; // Optional service name
}

export const generateTraceId = (
  service: GenerateTraceIdOptions['service'] = 'app' // Added default parameter
): string => {
  // Generate a UUID v4 for better compatibility and uniqueness
  return uuidv4();
};
