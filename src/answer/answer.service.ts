import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './schema/answer.schema';
import { QuestionService } from 'src/question/question.service';

@Injectable()
export class AnswerService {
  //依赖注入Answer模型
  constructor(
    @InjectModel(Answer.name) private readonly answerModel,
    private readonly questionService: QuestionService,
  ) {}

  //创建答案
  async create(answerInfo) {
    if (answerInfo.questionId == null) {
      throw new HttpException('缺少问卷ID', HttpStatus.BAD_REQUEST);
    }
    const answer = new this.answerModel(answerInfo);
    return await answer.save();
  }

  //查询问卷的答卷数量
  async count(questionId: string) {
    if (!questionId) return 0;
    return await this.answerModel.countDocuments({ questionId });
  }

  //查询所有问卷的答卷数量
  async countAll() {
    return await this.answerModel.countDocuments();
  }

  //查询问卷的答卷列表
  async findAll(questionId: string, opt: { page: number; pageSize: number }) {
    if (!questionId) return [];
    const { page = 1, pageSize = 10 } = opt;
    const list = await this.answerModel
      .find({ questionId })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return list;
  }
}
