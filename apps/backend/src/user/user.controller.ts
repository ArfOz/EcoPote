import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UnregisterUserDto } from './dto/user.dtos';
import { CreateUserDto, ResponseUnregisterUserDto } from '@shared/dtos';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // async findAll() {
  //   return this.userService.findAll();
  // }

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return await this.userService.register({
      email: data.email,
      name: data.name,
      subscription: data.subscription ?? true,
    });
  }

  @Post('unregister')
  async unregister(
    @Body() data: UnregisterUserDto
  ): Promise<ResponseUnregisterUserDto> {
    return await this.userService.unregister({
      email: data.email,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; email?: string; password?: string }
  ) {
    return this.userService.update(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
