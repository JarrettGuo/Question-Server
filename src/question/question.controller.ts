/**
 * 问题控制器
 * 用于处理问题相关的请求
 */
import { Controller, Get, Query, Param, Patch, Body, Post, Delete, Request } from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';
import { Public } from 'src/auth/decorators/public.devorator';

@Controller('question')
export class QuestionController {
  //依赖注入QuestionService
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async findAll(
    //使用@Query()装饰器获取查询参数 其中Query中的参数为查询参数的名称
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    //默认值为false
    @Query('isDeleted') isDeleted: boolean = false,
    @Query('isStar') isStar: boolean = false,
    @Request() req,
  ) {
    const { username } = req.user;

    //调用QuestionService的findAllList方法查询问题列表
    const list = await this.questionService.findAllList({
      keyword,
      page,
      pageSize,
      isDeleted,
      isStar,
      author: username,
    });
    //调用QuestionService的countAll方法查询问题总数
    const count = await this.questionService.countAll({ keyword, isDeleted, isStar, author: username });
    return { list: list, count: count };
  }

  //使用@Post()装饰器定义一个POST请求的路由
  @Post()
  //使用@Request()装饰器获取请求对象
  create(@Request() req) {
    const { username } = req.user;
    return this.questionService.create(username);
  }

  @Public()
  @Get(':id')
  //使用@Param()装饰器获取路由参数 其中Param中的参数为路由参数的名称
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  //使用@Param()装饰器获取路由参数 其中Param中的参数为路由参数的名称 使用@Body()装饰器获取请求体 @Request()装饰器获取请求对象
  update(@Param('id') id: string, @Body() questionDto: QuestionDto, @Request() req) {
    const { username } = req.user;
    return this.questionService.update(id, questionDto, username);
  }

  @Delete(':id')
  //使用@Param()装饰器获取路由参数 其中Param中的参数为路由参数的名称 使用@Request()装饰器获取请求对象
  delete(@Param('id') id: string, @Request() req) {
    const { username } = req.user;
    return this.questionService.delete(id, username);
  }

  @Delete()
  //使用@Body()装饰器获取请求体 @Request()装饰器获取请求对象
  deleteMany(@Body() body, @Request() req) {
    const { username } = req.user;
    const { ids = [] } = body;
    return this.questionService.deleteMany(ids, username);
  }

  @Post('duplicate/:id')
  //使用@Param()装饰器获取路由参数 其中Param中的参数为路由参数的名称 使用@Request()装饰器获取请求对象
  duplicate(@Param('id') id: string, @Request() req) {
    const { username } = req.user;
    return this.questionService.duplicate(id, username);
  }
}
