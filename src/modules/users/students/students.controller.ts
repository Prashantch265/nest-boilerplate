import {
  Controller,
  Get,
  Patch,
  UseInterceptors,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { USER_TYPE } from '../../../common/enums/users.enum';
import { Roles } from '../../../core/decorators/roles.decorator';
import { SuccessMessage } from '../../../core/decorators/success-message.decorator';
import { CustomFileValidatorPipe } from '../../../core/pipes/file-validation.pipe';
import { UpdateAddressDto } from './dtos/update-address-contact-dto';
import { UpdatePersonalInfoDto } from './dtos/update-personal-info.dto';
import { StudentService } from './students.service';

const profileImageRules = {
  fileType: '.(png|jpeg|jpg|pdf)',
  maxSizeMb: 5,
  required: false,
};

@ApiTags('Student Profile')
@Controller('student/profile')
@Roles(USER_TYPE.STUDENT, USER_TYPE.CONSULTANCY, USER_TYPE.ADMIN) // Protect all routes in this controller
export class StudentController {
  constructor(private readonly studentProfileService: StudentService) {}

  @Get()
  @ApiOperation({
    summary: "Get the authenticated student's complete profile",
    description:
      'Retrieves all profile information for the currently logged-in student, including personal details, education, test scores, and visa history.',
  })
  @SuccessMessage('Student profile retrieved successfully.')
  getProfile() {
    return this.studentProfileService.getStudentProfile();
  }

  @Patch('personal-info')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'passport', maxCount: 1 },
    ]),
  )
  @ApiOperation({
    summary: 'Update Step 1: Personal Information',
    description:
      "Updates the student's personal details, including name, DOB, and passport information. Also handles profile photo and passport file uploads.",
  })
  @ApiConsumes('multipart/form-data')
  @SuccessMessage('Personal information updated successfully.')
  updatePersonalInfo(
    @Body() updateDto: UpdatePersonalInfoDto,
    @UploadedFiles(
      new CustomFileValidatorPipe({
        photo: profileImageRules,
        passport: profileImageRules,
      }),
    )
    files: {
      photo?: Express.Multer.File[];
      passport?: Express.Multer.File[];
    },
  ) {
    return this.studentProfileService.updatePersonalInfo(
      updateDto,
      files ?? {},
    );
  }

  @Patch('address-contact')
  @ApiOperation({
    summary: 'Update Step 2: Address & Contact',
    description:
      "Updates the student's address, contact numbers, and parental information.",
  })
  @SuccessMessage('Address and contact information updated successfully.')
  updateAddress(@Body() updateDto: UpdateAddressDto) {
    return this.studentProfileService.updateAddress(updateDto);
  }
}
