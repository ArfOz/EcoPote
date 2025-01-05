import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  RegisterUserDto,
  UnregisterUserDto,
  UpdateUserDto,
} from './dto/user.dtos';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() data: RegisterUserDto) {
    return await this.userService.register({
      email: data.email,
      subscription: data.subscription ?? true,
    });
  }

  @Post('unregister')
  async unregister(@Body() data: UnregisterUserDto) {
    return await this.userService.unregister({
      email: data.email,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }

  @Get('showall')
  async findAll() {
    return this.userService.findAll();
  }

  @Post('update')
  async update(@Body() data: UpdateUserDto) {
    return await this.userService.update(data);
  }
}
