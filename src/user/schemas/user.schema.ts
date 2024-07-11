import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// 定义用户的数据结构 用于映射MongoDB中的文档
export type UserDocument = HydratedDocument<User>;

// 使用Schema装饰器定义数据结构
@Schema({
  timestamps: true, //记录时间戳 会自动添加createdAt和updatedAt两个字段
})
export class User {
  // 使用Prop装饰器定义字段
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  nickname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
