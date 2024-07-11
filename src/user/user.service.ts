import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  //依赖注入User模型
  constructor(@InjectModel(User.name) private readonly userModel) {}

  //创建用户
  async create(userData: CreateUserDto) {
    const createdUser = new this.userModel(userData);
    return await createdUser.save();
  }

  //查询用户
  async findOne(username: string, password: string) {
    return await this.userModel.findOne({ username, password });
  }
}
