/**
 * 定于创建用户的数据传输对象
 */
export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly nickname?: string;
}
