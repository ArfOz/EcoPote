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
import { CreateUserDto } from './dto/user.dtos';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // async findAll() {
  //   return this.userService.findAll();
  // }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Post()
  async create(@Body() data: CreateUserDto) {
    console.log(data);
    return await this.userService.create({
      ...data,
      subscripton: data.subscripton ?? true,
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
