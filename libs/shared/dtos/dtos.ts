import { User } from '@prisma/client';

export class ResponseGetAllusers {
  message!: string;
  success!: boolean;
  data!: {
    users: User[];
    total: number;
  };
}

export class ResponseLogout {
  message!: string;
  success!: boolean;
}

export class ResponseCreateUser {
  message!: string;
  success!: boolean;
}

export interface ResponseMessageEmail {
  data: {
    sentUsers: string[];
    errorUsers: string[];
  };
  message: string;
  success: boolean;
}

export interface ResponseToggleSubscription {
  data: User;
  message: string;
  success: boolean;
}

export interface ResponseDeleteUser {
  message: string;
  success: boolean;
}
