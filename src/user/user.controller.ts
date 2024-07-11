import { Controller, Redirect } from '@nestjs/common';
import { UserService } from './user.service';
import { Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/decorators/public.devorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //注册
  @Public()
  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    //调用UserService的create方法创建用户 如果出错则抛出异常
    try {
      return await this.userService.create(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  //获取用户信息
  @Public()
  @Get('info')
  //使用@Redirect()装饰器重定向到/api/auth/profile get请求302表示临时重定向状态码
  @Redirect('/api/auth/profile', 302)
  async getInfo() {
    return;
  }

  //登陆
  @Public()
  @Post('login')
  //使用@Redirect()装饰器重定向到/api/auth/login post请求307表示临时重定向状态码
  @Redirect('/api/auth/login', 307)
  async login() {
    return;
  }
}
