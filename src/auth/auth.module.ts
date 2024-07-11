import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UserModule,
    //引入JwtModule模块 用于生成token
    JwtModule.register({
      global: true, //全局注册
      secret: jwtConstants.secret, //密钥
      signOptions: { expiresIn: '0.5d' }, //过期时间 0.5天
    }),
  ],
  providers: [
    //引入AuthService服务 用于全局使用
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
