import { KeypairService } from '@shared/keypair/keypair.service';
import { Inject, Injectable } from '@nestjs/common';
import { Admin, User } from '@prisma/client';
import { AdminDatabaseService, UserDatabaseService } from '@database';
import generalConfig from '@shared/config/general.config';
import authConfig from '@shared/config/auth.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    private readonly userDatabaseService: UserDatabaseService,
    private readonly adminDatabaseService: AdminDatabaseService,
    @Inject(generalConfig.KEY)
    private readonly generalCfg: ConfigType<typeof generalConfig>,
    @Inject(authConfig.KEY)
    private readonly authCfg: ConfigType<typeof authConfig>,
    private readonly keypairService: KeypairService
  ) {}

  async addAdmin(adminData: {
    email: string;
    password: string;
  }): Promise<Admin> {
    const keys = this.keypairService.generateKey();

    // Encrypt the public and private keys
    const pubKey = this.keypairService.encryptData(
      this.generalCfg.publicKey,
      this.generalCfg.privateKey,
      keys.publicKey
    );
    const privKey = this.keypairService.encryptData(
      this.generalCfg.publicKey,
      this.generalCfg.privateKey,
      keys.secretKey
    );

    return this.adminDatabaseService.create({
      ...adminData,
      publicKey: pubKey,
      privateKey: privKey,
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    // Implement login logic here
    const token = 'your_generated_token'; // Replace with actual token generation logic
    return { token };
  }
  async logout(userId: number): Promise<void> {
    // Implement logout logic here
    // For example, you can invalidate the user's token or remove the session
    console.log(`User with ID ${userId} has been logged out.`);
  }

  async addUser(userData: {
    email: string;
    subscription: boolean;
  }): Promise<User> {
    return this.userDatabaseService.create(userData);
  }

  async removeUser(id: number): Promise<void> {
    await this.userDatabaseService.delete(id);
  }

  async listUsers(): Promise<User[]> {
    return this.userDatabaseService.findAll({});
  }
}
