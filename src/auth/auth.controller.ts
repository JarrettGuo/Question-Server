import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
// import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.devorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //登录 通过用户名和密码查询用户 如果查询到则返回用户信息
  //添加@Public()装饰器表示该接口不需要token验证
  @Public()
  @Post('login')
  async login(@Body() userInfo: CreateUserDto) {
    const { username, password } = userInfo;
    return await this.authService.signIn(username, password);
  }

  //获取用户信息 通过token获取用户信息 useGuard是一个守卫,用于验证token
  //   @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
