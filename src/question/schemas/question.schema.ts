/***
 * 定义问题的数据结构
 * 用于映射MongoDB中的文档
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// 定义问题的数据结构 用于映射MongoDB中的文档
export type QuestionDocument = HydratedDocument<Question>;

// 使用Schema装饰器定义数据结构
@Schema({
  timestamps: true, //记录时间戳
})
export class Question {
  // 使用Prop装饰器定义字段
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop()
  js: string;

  @Prop()
  css: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isStar: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ required: true })
  author: string;

  @Prop()
  componentList: {
    fe_id: string; //前端组件id 用于前端组件的唯一标识
    type: string; //组件类型
    title: string; //组件标题
    isHidden: boolean; //是否隐藏
    isLocked: boolean; //是否锁定
    props: object; //组件属性
  }[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
