export interface UserData {
  email: FormDataEntryValue | null;
  subscription?: boolean;
}
export interface ResponseStatus {
  data: { sentUsers: string[]; errorUsers: string[] };
  success: boolean;
  message: string;
}

export interface Status {
  sentUsers: string[];
  errorUsers: string[];
  message: string;
}
