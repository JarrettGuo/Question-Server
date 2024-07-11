/**
 * User Module
 * 用户模块
 * 用于处理用户相关的业务逻辑
 */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  //导出UserService服务 用于在其他模块中使用
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
