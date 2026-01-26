import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IStorageService } from '../../../common/interfaces/storage.interface';
import { ContextService } from '../../../core/context/context.service';
import { getUserStorageDirectory } from '../../../core/utils/helpers/user-storage-directory.helper';
import { CreateStudentDto } from './dtos/create-student.dto';
import { UpdateAddressDto } from './dtos/update-address-contact-dto';
import { UpdatePersonalInfoDto } from './dtos/update-personal-info.dto';
import { Student } from './entities/students.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly contextService: ContextService,

    @Inject('IStorageService')
    private readonly storageService: IStorageService,
  ) {}

  /**
   * Creates a new student profile linked to a user account.
   */
  async createStudent(studentData: CreateStudentDto): Promise<Student> {
    const newStudent = this.studentRepository.create(studentData);
    return this.studentRepository.save(newStudent);
  }

  /**
   * Finds a student profile by their associated userId.
   * Throws a NotFoundException if the profile is not found.
   */
  async getStudentByUserId(userId: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { user: { userId: userId } },
    });
    if (!student) {
      throw new NotFoundException(
        `Student profile for user ID ${userId} not found`,
      );
    }
    return student;
  }

  /**
   * Retrieves the complete profile for the authenticated student.
   */
  async getStudentProfile(): Promise<Student> {
    const currentUser = this.contextService.currentUser;
    const student = await this.studentRepository.findOne({
      where: { user: { userId: currentUser.userId } },
      // relations: ["educationBackgrounds", "testScores", "visaHistories"],
    });

    if (!student) {
      throw new UnauthorizedException('Student profile not found.');
    }
    return student;
  }

  /**
   * Helper function to get the current student and update their profile step.
   */
  private async getCurrentStudentAndUpdateStep(
    newStep: number,
  ): Promise<Student> {
    const currentUser = this.contextService.currentUser;
    const student = await this.studentRepository.findOne({
      where: { user: { userId: currentUser.userId } },
    });

    if (!student) {
      throw new UnauthorizedException('Student profile not found.');
    }

    // Update profile step if it's a forward progression
    if (newStep > student.profileCompletionStep) {
      student.profileCompletionStep = newStep;
    }

    return student;
  }

  /**
   * Updates the personal information for the authenticated student.
   * Handles file uploads by deleting the old file before saving the new one.
   */
  async updatePersonalInfo(
    dto: UpdatePersonalInfoDto,
    files: { photo?: Express.Multer.File[]; passport?: Express.Multer.File[] },
  ): Promise<Student> {
    const student = await this.getCurrentStudentAndUpdateStep(1);
    const userDirectory = getUserStorageDirectory(
      this.contextService.currentUser,
    );
    let photoUrl: string | undefined;
    if (files.photo?.[0]) {
      if (student.photoUrl) {
        await this.storageService.delete(student.photoUrl);
      }
      const storedFile = await this.storageService.save(
        files.photo[0],
        `${userDirectory}/documents`,
      );
      photoUrl = storedFile.path;
    }
    let passportFileUrl: string | undefined;
    if (files.passport?.[0]) {
      if (student.passportFileUrl) {
        await this.storageService.delete(student.passportFileUrl);
      }
      const storedFile = await this.storageService.save(
        files.passport[0],
        `${userDirectory}/documents`,
      );
      passportFileUrl = storedFile.path;
    }
    this.studentRepository.merge(student, dto, { photoUrl, passportFileUrl });
    return this.studentRepository.save(student);
  }

  /**
   * Updates the address and contact information for the authenticated student.
   */
  async updateAddress(dto: UpdateAddressDto): Promise<Student> {
    const student = await this.getCurrentStudentAndUpdateStep(2);
    this.studentRepository.merge(student, dto);
    return this.studentRepository.save(student);
  }
}
