import { HttpException, HttpStatus } from '@nestjs/common';

export class DecryptKeyException extends HttpException {
    constructor(keyInfo: string) {
        super(`Can't decrypt ${keyInfo} key`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
