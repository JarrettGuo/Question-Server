import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';

@Injectable()
export class QuestionService {
  //依赖注入Question模型
  constructor(@InjectModel(Question.name) private readonly questionModel) {}

  //查询一个问题
  async findOne(id: string) {
    return await this.questionModel.findById(id);
  }

  //删除一个问题
  async delete(id: string, author: string) {
    // return await this.questionModel.findByIdAndDelete(id);
    const res = await this.questionModel.findOneAndUpdate({ _id: id, author });
    return res;
  }

  //删除多个问题
  async deleteMany(ids: string[], author: string) {
    //判断是否有删除权限 通过作者和id查询问题 in:查询多个id
    const res = await this.questionModel.deleteMany({ _id: { $in: ids }, author });
    return res;
  }

  //创建问题
  async create(username: string) {
    return await this.questionModel.create({
      title: 'Question Title',
      desc: 'Question Description',
      author: username,
      componentList: [
        {
          fe_id: nanoid(),
          type: 'questionInfo',
          title: 'Question Info',
          props: {
            title: 'Title',
            desc: 'Description',
          },
        },
      ],
    });
  }

  //更新问题
  async update(id: string, updateData, author: string) {
    return await this.questionModel.findByIdAndUpdate({ _id: id, author }, updateData);
  }

  //查询问题列表
  async findAllList({ keyword = '', page = 1, pageSize = 10, isDeleted = false, isStar, author = '' }) {
    //查询条件 默认查询未删除的问题 以及作者为当前用户的问题
    const whereOpt: any = { author, isDeleted };
    //如果是星标问题 则查询星标问题
    if (isStar) {
      whereOpt.isStar = isStar;
    }
    //如果有关键字 则进行模糊查询
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      //模糊查询
      whereOpt.title = { $regex: reg };
    }
    return await this.questionModel
      //查询条件
      .find(whereOpt)
      //逆序排序
      .sort({ _id: -1 })
      //跳过的条数 用于分页
      .skip((page - 1) * pageSize)
      //限制的条数
      .limit(pageSize);
  }

  //查询问题总数 用于分页
  async countAll({ keyword = '', author = '', isDeleted = false, isStar }) {
    //查询条件 默认查询未删除的问题 以及作者为当前用户的问题
    const whereOpt: any = { author, isDeleted };
    //如果是星标问题 则查询星标问题
    if (isStar) {
      whereOpt.isStar = isStar;
    }
    //如果有关键字 则进行模糊查询
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      //模糊查询
      whereOpt.title = { $regex: reg };
    }
    return await this.questionModel.countDocuments(whereOpt);
  }

  //查询问卷总数
  async countAllQuestion() {
    return await this.questionModel.countDocuments();
  }
  //查询已发布问卷总数
  async countPublishedQuestion() {
    return await this.questionModel.countDocuments({ isPublished: true });
  }

  //复制问卷
  async duplicate(id: string, author: string) {
    //查询问题
    const question = await this.questionModel.findById(id);
    //复制问题
    const newQuestion = await this.questionModel({
      ...question.toObject(), //获取问题的数据的原始数据
      _id: new Types.ObjectId(), //生成新的id
      title: question.title + ' Copy',
      author,
      isPublished: false,
      isStar: false,
      componentList: question.componentList.map((item) => {
        return {
          ...item,
          fe_id: nanoid(),
        };
      }),
    });
    return await newQuestion.save();
  }
}
