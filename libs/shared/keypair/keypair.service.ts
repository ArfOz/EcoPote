// import { InternalServerException } from '@shared';

// ** NestJS imports **
import { Inject, Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { isDefined, isEmpty } from 'class-validator';

// ** Third-party imports **
import nacl from 'tweetnacl';
// import { DecryptKeyException } from './exceptions';
import { ConfigType } from '@nestjs/config';
import generalConfig from '../config/general.config';

@Injectable()
export class KeypairService {
  constructor(
    @Inject(generalConfig.KEY)
    private readonly generalCfg: ConfigType<typeof generalConfig>
  ) {}

  encryptData(publicKey: string, secretKey: string, data: any): string {
    if (isEmpty(publicKey) || isEmpty(secretKey)) {
      //   throw new InternalServerException(
      //     new Error('User has no public or private key on database to encrpyt.')
      //   );
    }
    try {
      const [databuff, nonce, publicbuff, privatebuff] = [
        Buffer.from(data),
        Buffer.from(this.generalCfg.nonce, 'base64'),
        Buffer.from(publicKey, 'base64'),
        Buffer.from(secretKey, 'base64'),
      ];

      if (
        !isDefined(databuff) ||
        !isDefined(nonce) ||
        !isDefined(publicbuff) ||
        !isDefined(privatebuff)
      ) {
        // throw new InternalServerException(
        //   new Error('Error parsing encryption data.')
        // );
      }
      // then we encrypt the data using the public key
      const encrypted = nacl.box(databuff, nonce, publicbuff, privatebuff);
      // return encrypted as a base64 string
      return Buffer.from(encrypted).toString('base64');
    } catch (error) {
      //   throw new InternalServerException(new Error('Error encrypting data.'));
    }
  }

  decryptData(publicKey: string, secretKey: string, data: any): string {
    if (isEmpty(publicKey) || isEmpty(secretKey)) {
      //   throw new InternalServerException(
      //     new Error('User has no public or private key on database to decrypty.')
      //   );
    }
    try {
      const [databuff, nonce, publicbuff, privatebuff] = [
        Buffer.from(data, 'base64'),
        Buffer.from(this.generalCfg.nonce, 'base64'),
        Buffer.from(publicKey, 'base64'),
        Buffer.from(secretKey, 'base64'),
      ];

      if (
        !isDefined(databuff) ||
        !isDefined(nonce) ||
        !isDefined(publicbuff) ||
        !isDefined(privatebuff)
      ) {
        // throw new InternalServerException(
        //   new Error('Error parsing decryption data.')
        // );
      }

      // then we decrypt the data using the private key
      const decrypted = nacl.box.open(databuff, nonce, publicbuff, privatebuff);

      // return decrypted as a base64 string
      if (!decrypted) {
        throw new Error('Decryption failed');
      }
      return Buffer.from(decrypted).toString('utf8');
    } catch (error) {
      //   throw new InternalServerException(new Error('Error decrypting data.'));
    }
  }

  encryptWithAppKeys(data: any): string {
    return this.encryptData(
      this.generalCfg.publicKey,
      this.generalCfg.privateKey,
      data
    );
  }

  decryptWithAppKeys(data: any): string {
    return this.decryptData(
      this.generalCfg.publicKey,
      this.generalCfg.privateKey,
      data
    );
  }

  generateKey() {
    // Generate a public and secret key
    const { publicKey, secretKey } = nacl.box.keyPair();

    // return the keys as a base64 string
    return {
      publicKey: Buffer.from(publicKey).toString('base64'),
      secretKey: Buffer.from(secretKey).toString('base64'),
    };
  }

  decryptWithUser(admin: Admin, data: any): string {
    try {
      const privKey = this.decryptWithAppKeys(admin.PrivateKey);
      const pubKey = this.decryptWithAppKeys(admin.PublicKey);
      return this.decryptData(pubKey, privKey, data);
    } catch (error) {
      //   throw new DecryptKeyException(user.Id.toString());
    }
  }

  encryptWithUser(user: Admin, data: any): string {
    const privKey = this.decryptWithAppKeys(user.PrivateKey);
    const pubKey = this.decryptWithAppKeys(user.PublicKey);
    return this.encryptData(pubKey, privKey, data);
  }
}
