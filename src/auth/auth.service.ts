import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  //登录 通过用户名和密码查询用户 如果查询到则返回用户信息
  async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username, password);
    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }
    //密码不返回 保证安全
    const { password: p, ...userInfo } = user.toObject(); //eslint-disable-line

    // return userInfo;
    //返回token
    return {
      token: this.jwtService.sign(userInfo),
    };
  }
}
