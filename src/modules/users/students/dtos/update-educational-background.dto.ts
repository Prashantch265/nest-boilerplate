import { PartialType } from '@nestjs/swagger';
import { CreateEducationBackgroundDto } from './create-education-background.dto';

export class UpdateEducationBackgroundDto extends PartialType(
  CreateEducationBackgroundDto,
) {}
