import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Headers,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Multer } from 'multer';
import { JwtAuthGuard } from '@auth';
import { CreateAddNewsDto, CreateAdminDto, UpdateNewsDto } from './dto';
import {
  CreateUserDto,
  ResponseCreateUser,
  ResponseDeleteNews,
  ResponseDeleteUser,
  ResponseGetAllusers,
  ResponseLogin,
  ResponseLogout,
  ResponseMessageEmail,
  ResponseTips,
  ResponseTipsDetails,
  ResponseTipNews,
  ResponseToggleSubscription,
  ResponseAddNews,
  ResponseUpdateNews,
} from '@shared/dtos';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('test')
  async test(): Promise<string> {
    console.log('Test endpoint hit!', new Date().toISOString());
    return 'Test endpoint is working!';
  }

  @Post('create')
  async createAdmin(@Body() createAdminData: CreateAdminDto): Promise<Admin> {
    return this.adminService.addAdmin(createAdminData);
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string }
  ): Promise<ResponseLogin> {
    return await this.adminService.login(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @Headers('Authorization') token: string
  ): Promise<ResponseLogout> {
    return await this.adminService.logout(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-user')
  async createUser(
    @Body() userData: CreateUserDto
  ): Promise<ResponseCreateUser> {
    return await this.adminService.addUser(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: number): Promise<ResponseDeleteUser> {
    return await this.adminService.removeUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ): Promise<ResponseGetAllusers> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.adminService.listUsers(pageNumber, limitNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Post('users/:id/toggle-subscription')
  async toggleSubscription(
    @Param('id') id: string
  ): Promise<ResponseToggleSubscription> {
    return await this.adminService.toggleSubscription(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Post('tips-add')
  @UseInterceptors(FileInterceptor('file'))
  async addTips(
    @Body() tipsData: { title: string; description: string },
    @UploadedFile() file?: Express.Multer.File | undefined
  ) {
    let htmlContent;
    if (file) {
      htmlContent = fs.readFileSync(file.path, 'utf8'); // Use file.path directly
    }
    return await this.adminService.addTips(tipsData, htmlContent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tips')
  async getTips(): Promise<ResponseTips> {
    return await this.adminService.getTips();
  }

  @UseGuards(JwtAuthGuard)
  @Get('tips/:id')
  async getTipsById(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ): Promise<ResponseTipsDetails> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.adminService.getTipsById(
      parseInt(id, 10),
      pageNumber,
      limitNumber
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('news/add')
  @UseInterceptors(FileInterceptor('file'))
  async addNews(
    @UploadedFile() file: Express.Multer.File,
    @Body() newsData: CreateAddNewsDto
  ): Promise<ResponseAddNews> {
    if (!file) {
      console.error('File not provided');
      throw new Error('File not provided');
    }

    const htmlContent = fs.readFileSync(file.path, 'utf8'); // Use file.path directly

    return await this.adminService.addNews(newsData, htmlContent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tips/news/:id')
  async getNews(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ): Promise<ResponseTipNews> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.adminService.getNews(
      parseInt(id, 10),
      pageNumber,
      limitNumber
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('news/:id')
  async getNewsById(@Param('id') id: string) {
    return await this.adminService.getNewsById(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file')) // <-- Add this line
  @Post('news/update/:id')
  async updateNews(
    @Param('id') id: string,
    @Body() newsData: UpdateNewsDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResponseUpdateNews> {
    return await this.adminService.updateNews(parseInt(id, 10), newsData, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('news/:id')
  async deleteNews(@Param('id') id: string): Promise<ResponseDeleteNews> {
    return await this.adminService.deleteNews(parseInt(id, 10));
  }
}
