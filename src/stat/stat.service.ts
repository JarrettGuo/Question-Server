import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';
import { AnswerService } from 'src/answer/answer.service';

@Injectable()
export class StatService {
  //将QuestionService和AnswerService注入到StatService中
  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  //获取radio统计数据
  private _getRadioOptText(value, props: any = {}) {
    const { options = [] } = props;
    const length = options.length;

    for (let i = 0; i < length; i++) {
      const item = options[i];
      if (item.value === value) {
        return item.text;
        break;
      }
    }
    return '';
  }

  //获取checkbox统计数据
  private _getCheckboxOptText(value, props: any = {}) {
    const { list = [] } = props;
    const length = list.length;

    for (let i = 0; i < length; i++) {
      const item = list[i];
      if (item.value === value) {
        return item.text;
        break;
      }
    }
    return '';
  }

  //获取答案信息
  private _getAnswersInfo(question, answerList = []) {
    const res = {};
    // console.log('question:', question);
    const { componentList = [] } = question;

    answerList.forEach((answer) => {
      //   console.log('answer', answer);
      const { componentId, value = [] } = answer;
      //   console.log('componentId:', componentId);

      // Ensure value is an array
      const valueArray = Array.isArray(value) ? value : [value];

      // Get component information
      const component = componentList.find((item) => item.fe_id === componentId);
      if (!component) {
        // console.log(`Component with ID ${componentId} not found.`);
        return;
      }
      //   console.log('component:', component);
      const { type, props = {} } = component;
      //   console.log('type:', type);

      if (type === 'questionRadio') {
        res[componentId] = valueArray.map((item) => this._getRadioOptText(item, props)).join(', ');
      } else if (type === 'questionCheckbox') {
        res[componentId] = valueArray.map((item) => this._getCheckboxOptText(item, props)).join(', ');
      } else {
        res[componentId] = valueArray.join(', ');
      }
    });

    return res;
  }

  //获取单个问题的案例列表(分页)和数量
  async getQuestionStatListAndCount(questionId: string, opt: { page: number; pageSize: number }) {
    const noData = { list: [], count: 0 };
    //如果没有问题ID 则返回空数据
    if (!questionId) return noData;

    //查询问题
    const question = await this.questionService.findOne(questionId);
    //如果问题不存在 则返回空数据
    if (question == null) return noData;

    //查询答案数量
    const count = await this.answerService.count(questionId);
    //如果答案数量为0 则返回空数据
    if (count === 0) return noData;

    //查询答案列表
    const answers = await this.answerService.findAll(questionId, opt);
    //获取答案信息
    const list = answers.map((answer) => {
      return {
        _id: answer._id,
        ...this._getAnswersInfo(question, answer.answerList),
      };
    });

    return { list, count };
  }

  //获取单个组件的统计数据
  async getComponentStat(questionId: string, componentFeId: string) {
    if (!questionId || !componentFeId) return [];

    //获取问题信息
    const question = await this.questionService.findOne(questionId);
    if (question == null) return [];
    // console.log('question:', question);
    //获取组件
    const { componentList = [] } = question;
    const component = componentList.filter((item) => item.fe_id === componentFeId)[0];
    if (!component) return [];
    // console.log('component:', component);

    const { type, props } = component;
    //如果组件类型不是单选或多选 则返回空数据
    if (type !== 'questionRadio' && type !== 'questionCheckbox') return [];

    //获取答案列表
    const total = await this.answerService.count(questionId);
    if (total === 0) return [];
    const answers = await this.answerService.findAll(questionId, { page: 1, pageSize: total });

    //累加统计数据
    const countInfo = {};
    answers.forEach((answer) => {
      answer.answerList.forEach((item) => {
        if (item.componentId !== componentFeId) return;
        const valueArray = Array.isArray(item.value) ? item.value : [item.value];
        valueArray.forEach((value) => {
          if (countInfo[value] == null) countInfo[value] = 0;
          countInfo[value]++;
        });
      });
    });

    //整理数据
    const list = [];
    for (const val in countInfo) {
      //根据val计算text
      let text = '';
      if (type === 'questionRadio') {
        text = this._getRadioOptText(val, props);
      }
      if (type === 'questionCheckbox') {
        text = this._getCheckboxOptText(val, props);
      }

      list.push({ name: text, count: countInfo[val] });
    }

    return list;
  }

  //获取问题数量和答卷数量
  async getStatCount() {
    //查询问题总数
    const questionCount = await this.questionService.countAllQuestion();
    //查询答卷总数
    const answerCount = await this.answerService.countAll();
    //查询已发布问题总数
    const publishedCount = await this.questionService.countPublishedQuestion();

    return { questionCount, answerCount, publishedCount };
  }
}
