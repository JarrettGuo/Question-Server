import { Controller, Get, Query, Param } from '@nestjs/common';
import { StatService } from './stat.service';
import { Public } from 'src/auth/decorators/public.devorator';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  //获取问卷统计
  @Get(':questionId')
  async getQuestionStat(
    @Param('questionId') questionId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return await this.statService.getQuestionStatListAndCount(questionId, { page, pageSize });
  }

  //获取组件统计
  @Get(':questionId/:componentFeId')
  async getComponentStat(@Param('questionId') questionId: string, @Param('componentFeId') componentFeId: string) {
    const stat = await this.statService.getComponentStat(questionId, componentFeId);
    return { stat };
  }

  //获取所有问卷和答卷数量
  @Public()
  @Get()
  async getAllStat() {
    return await this.statService.getStatCount();
  }
}
