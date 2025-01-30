export interface ResponseStatus {
  message: { sentUsers: string[]; errorUsers: string[]; message: string };
  Success: boolean;
}

export interface Status {
  sentUsers: string[];
  errorUsers: string[];
  message: string;
}
