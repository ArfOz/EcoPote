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
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Multer } from 'multer';
import { AuthMode, JwtAuthGuard } from '@auth';
import { NewsService } from './news.service';
import {
  ResponseAddNews,
  ResponseDeleteNews,
  ResponseNewsOrderDto,
  ResponseNewsAllDto,
  ResponseMessageNews,
  ResponseTipNews,
  ResponseTips,
  ResponseTipsDetails,
  ResponseUpdateNews,
  CronTimeSetEnum,
} from '@shared/dtos';
import { CreateAddNewsDto, UpdateNewsDto } from './dtos';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @AuthMode('static')
  @UseGuards(JwtAuthGuard)
  @Post('status')
  async getStatus(@Body() body: { schedule: string }): Promise<string> {
    return this.newsService.getStatus({ schedule: body.schedule });
  }

  @AuthMode('static')
  @UseGuards(JwtAuthGuard)
  @Post('automatednews')
  async automatedNews(
    @Body() body: { schedule: keyof typeof CronTimeSetEnum; startDate: Date }
  ): Promise<ResponseMessageNews> {
    return await this.newsService.automatedNews({
      schedule: body.schedule,
      startDate: body.startDate,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('sendnews')
  @UseInterceptors(FileInterceptor('file'))
  async sendNews(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { subject: string }
  ): Promise<ResponseMessageNews> {
    if (!file) {
      throw new Error('File not provided');
    }
    const htmlContent = fs.readFileSync(file.path, 'utf8'); // Use file.path directly

    return await this.newsService.sendNews({
      to: 'all',
      subject: body.subject,
      html: htmlContent,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('newsorder')
  async getNewsOrder(): Promise<ResponseNewsOrderDto> {
    return await this.newsService.getNewsOrder();
  }

  @UseGuards(JwtAuthGuard)
  @Get('allnews')
  async allNews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('order') order?: string,
    @Query('status') status?: boolean
  ): Promise<ResponseNewsAllDto> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    console.log('status', status);
    return await this.newsService.allNews(
      pageNumber,
      limitNumber,
      order,
      status
    );
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
    return await this.newsService.addTips(tipsData, htmlContent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tips')
  async getTips(): Promise<ResponseTips> {
    return await this.newsService.getTips();
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
    return await this.newsService.getTipsById(
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

    return await this.newsService.addNews(newsData, htmlContent);
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
    return await this.newsService.getNews(
      parseInt(id, 10),
      pageNumber,
      limitNumber
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('news/:id')
  async getNewsById(@Param('id') id: string) {
    return await this.newsService.getNewsById(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file')) // <-- Add this line
  @Post('news/update/:id')
  async updateNews(
    @Param('id') id: string,
    @Body() newsData: UpdateNewsDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResponseUpdateNews> {
    let htmlContent;
    if (file) {
      htmlContent = fs.readFileSync(file.path, 'utf8'); // Use file.path directly
    }
    return await this.newsService.updateNews(
      parseInt(id, 10),
      newsData,
      htmlContent
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('news/:id')
  async deleteNews(@Param('id') id: string): Promise<ResponseDeleteNews> {
    return await this.newsService.deleteNews(parseInt(id, 10));
  }
}
