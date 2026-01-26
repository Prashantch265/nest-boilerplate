import { PartialType } from '@nestjs/swagger';
import { CreateTestScoreDto } from './create-test-score.dto';

export class UpdateTestScoreDto extends PartialType(CreateTestScoreDto) {}
