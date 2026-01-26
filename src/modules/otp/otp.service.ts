import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { generateOtp } from '../../core/utils/helpers/otp.helper';
import { User } from '../users/users.entity';
import { Otp } from './entities/otp.entity';
import { OTP_STATUS } from './enums/otp-status.enum';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  /**
   * Creates a new OTP for a user and sets an expiration time.
   * @param user - The user entity for whom the OTP is generated.
   * @param minutesToExpire - The number of minutes until the OTP expires.
   */
  async createOtp(user: User, minutesToExpire: number = 10): Promise<string> {
    const otpCode = generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + minutesToExpire);

    const newOtp = this.otpRepository.create({
      user: { userId: user.userId },
      otpCode,
      expiresAt,
    });

    await this.otpRepository.save(newOtp);
    return otpCode;
  }

  /**
   * Finds a valid (pending and non-expired) OTP for a given user and code.
   */
  async findValidOtp(userId: string, otpCode: string): Promise<Otp | null> {
    return this.otpRepository.findOne({
      where: {
        user: { userId: userId },
        otpCode,
        status: OTP_STATUS.PENDING,
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  /**
   * Updates the status of an OTP to 'VERIFIED'.
   * @param id - The ID of the OTP record to update.
   */
  async markOtpAsVerified(id: string): Promise<void> {
    await this.otpRepository.update(id, { status: OTP_STATUS.VERIFIED });
  }

  /**
   * A scheduled task that runs every hour to mark expired OTPs.
   * This requires the ScheduleModule to be imported in the AppModule.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredOtps() {
    this.logger.log('Running scheduled task to handle expired OTPs...');

    const result = await this.otpRepository.update(
      {
        status: OTP_STATUS.PENDING,
        expiresAt: LessThan(new Date()), // Find OTPs where expiresAt is in the past
      },
      {
        status: OTP_STATUS.EXPIRED, // Update their status
      },
    );

    if (result.affected && result.affected > 0) {
      this.logger.log(`Marked ${result.affected} OTP(s) as EXPIRED.`);
    }
  }
}
