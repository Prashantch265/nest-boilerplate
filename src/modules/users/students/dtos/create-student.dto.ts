import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../users.entity';

export class CreateStudentDto {
  @IsNotEmpty()
  user: Partial<User>;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
