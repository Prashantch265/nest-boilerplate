import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_TYPE, USER_STATUS } from '../../../common/enums/users.enum';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminProfileDto } from './dtos/update-admin.dto';
import { RoleService } from '../../../core/rbac/roles/roles.service';
import { UserService } from '../users.service';
import { Admin } from './entities/admin.entity';
import { AdminQueryDto } from './dtos/query-admin.dto';
import { IPaginatedResponse } from '../../../common/interfaces/pagination.interface';
import {
  formatPaginatedResponse,
  getPaginationParams,
} from '../../../core/utils/helpers/pagination.helper';
import { Role } from '../../../core/rbac/roles/roles.entity';
import { User } from '../users.entity';
import { UpdateAdminStatusDto } from './dtos/update-admin-status.dto';
import { ContextService } from '../../../core/context/context.service';
import { AssignAdminRolesDto } from './dtos/assign-admin-roles.dto';
import { ChangeAdminPasswordDto } from './dtos/change-admin-password.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly contextService: ContextService,
  ) {}

  /**
   * Creates a new admin user, their associated user record, and assigns roles.
   */
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { email, password, confirmPassword, roleIds, ...adminProfileData } =
      createAdminDto;

    // --- Password Confirmation Check ---
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // 1. Check if user already exists
    const existingUser = await this.userService.getUserWithWhereCondition({
      email,
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    // 2. Create the core user record
    const newUser = await this.userService.createUserWithEmailAndPassword({
      email,
      password,
      userType: USER_TYPE.ADMIN,
    });
    await this.userService.updateUserStatus(newUser.userId, USER_STATUS.ACTIVE);

    // 3. Find the roles to be assigned by delegating to RolesService
    const roles = await this.roleService.findMultipleByIds(roleIds);

    // 4. Assign roles to the user and save
    newUser.roles = roles;
    await this.userService.saveUser(newUser);

    // 5. Create the admin profile
    const adminProfile = this.adminRepository.create({
      ...adminProfileData,
      user: { userId: newUser.userId },
    });

    const savedAdmin = await this.adminRepository.save(adminProfile);
    return this.findOne(savedAdmin.adminId);
  }

  /**
   * Retrieves a paginated list of admin users using a two-query approach to handle roles.
   * Selects only necessary fields for the list view.
   */
  async findAllPaginated(
    query: AdminQueryDto,
  ): Promise<IPaginatedResponse<Admin>> {
    const { limit, offset, sortOrder, sortBy } = getPaginationParams(
      query.page,
      query.size,
      query.sort as 'ASC' | 'DESC',
      query.sortBy, // DTO now validates allowed columns
    );

    // --- Query 1: Fetch Paginated Admins (without roles) ---
    const qb = this.adminRepository.createQueryBuilder('admin');
    qb.innerJoin('admin.user', 'user') // Join user table
      .select([
        // Select only necessary fields for the list
        'admin.adminId',
        'admin.firstName',
        'admin.lastName',
        'user.userId',
        'user.email',
        'user.status',
        'user.lastLoginAt',
      ]);

    // Apply search filter
    if (query.search) {
      qb.andWhere(
        '(admin.firstName ILIKE :search OR admin.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Apply status filter
    if (query.status) {
      qb.andWhere('user.status = :status', { status: query.status });
    }

    // Map DTO sortBy to actual database columns
    let sortColumn = 'admin.createdAt'; // Default sort
    if (sortBy === 'firstName') {
      sortColumn = 'admin.firstName';
    } else if (sortBy === 'email') {
      sortColumn = 'user.email';
    } else if (sortBy === 'lastLoginAt') {
      sortColumn = 'user.lastLoginAt';
    } else if (sortBy === 'createdAt') {
      sortColumn = 'admin.createdAt';
    } else if (sortBy === 'updatedAt') {
      sortColumn = 'admin.updatedAt';
    }

    qb.orderBy(sortColumn, sortOrder, 'NULLS LAST').skip(offset).take(limit);

    const [admins, totalRecords] = await qb.getManyAndCount();

    // --- Query 2: Fetch Roles for the retrieved Admins ---
    if (admins.length > 0) {
      const userIds = admins.map((admin) => admin.user.userId);

      // Use UserService to fetch users with roles
      const usersWithRoles =
        await this.userService.findUsersWithRolesByIds(userIds);

      // Create a map for easy lookup: userId -> roles[]
      const rolesMap = new Map<string, Role[]>();
      usersWithRoles.forEach((u) => rolesMap.set(u.userId, u.roles));

      // Attach roles to the admin objects from Query 1
      admins.forEach((admin) => {
        // Ensure the user object exists before trying to access userId
        if (admin.user) {
          admin.user.roles = rolesMap.get(admin.user.userId) || [];
        } else {
          // Handle cases where the user relation might unexpectedly be missing
          admin.user = { roles: [] } as unknown as User; // Add a placeholder user with empty roles
        }
      });
    }
    // --- End Role Mapping ---

    return formatPaginatedResponse(
      totalRecords,
      admins,
      query.page,
      query.size,
    );
  }

  /**
   * Retrieves a single admin profile by its ID.
   */
  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { adminId: id },
      relations: ['user', 'user.roles'],
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    delete admin.user.password;
    return admin;
  }

  /**
   * Updates an admin's basic profile information (name, position, contact, email).
   */
  async updateProfile(
    adminId: string,
    updateDto: UpdateAdminProfileDto,
  ): Promise<Admin> {
    const admin = await this.findOne(adminId);
    const { email, ...adminProfileData } = updateDto;

    // Update admin-specific fields
    this.adminRepository.merge(admin, adminProfileData);
    await this.adminRepository.save(admin);

    // Update email on the user record if provided
    if (email && email !== admin.user.email) {
      const existingUser = await this.userService.getUserWithWhereCondition({
        email,
      });
      if (existingUser && existingUser.userId !== admin.user.userId) {
        throw new ConflictException(
          'Another user with this email already exists.',
        );
      }
      admin.user.email = email;
      await this.userService.saveUser(admin.user);
    }

    return this.findOne(adminId); // Re-fetch for consistency
  }

  /**
   * Changes an admin's password.
   */
  async changePassword(
    adminId: string,
    changePasswordDto: ChangeAdminPasswordDto,
  ): Promise<void> {
    // --- Password Confirmation Check ---
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const admin = await this.findOne(adminId);
    await this.userService.updateUserPassword(
      admin.user.userId,
      changePasswordDto.newPassword,
    );
  }

  /**
   * Assigns roles to an admin, replacing any existing roles.
   */
  async assignRoles(
    adminId: string,
    assignRolesDto: AssignAdminRolesDto,
  ): Promise<Admin> {
    const admin = await this.findOne(adminId);
    const roles = await this.roleService.findMultipleByIds(
      assignRolesDto.roleIds,
    );

    admin.user.roles = roles; // Update roles on the loaded user entity
    await this.userService.saveUser(admin.user);

    return this.findOne(adminId); // Re-fetch to return updated admin with roles
  }

  /**
   * Updates the status (ACTIVE/INACTIVE) of an admin user.
   */
  async updateStatus(
    adminId: string,
    updateStatusDto: UpdateAdminStatusDto,
  ): Promise<Admin> {
    const admin = await this.findOne(adminId);

    // Optional: Prevent self-deactivation (requires ContextService)
    const currentUser = this.contextService.currentUser;
    if (
      admin.user.userId === currentUser.userId &&
      updateStatusDto.status === USER_STATUS.INACTIVE
    ) {
      throw new BadRequestException('You cannot deactivate your own account.');
    }

    if (
      ![USER_STATUS.ACTIVE, USER_STATUS.INACTIVE].includes(
        updateStatusDto.status,
      )
    ) {
      throw new BadRequestException(
        'Invalid status provided. Only ACTIVE or INACTIVE are allowed.',
      );
    }

    await this.userService.updateUserStatus(
      admin.user.userId,
      updateStatusDto.status,
    );

    // Update status in the loaded entity for immediate return
    admin.user.status = updateStatusDto.status;
    return admin;
  }

  /**
   * Deletes an admin profile and its associated user record.
   */
  async remove(id: string): Promise<void> {
    const admin = await this.findOne(id);
    // The user record will be deleted via CASCADE constraint on the User entity
    await this.adminRepository.remove(admin);
  }

  /**
   * Fetch admin profile
   */
  async getAdminByUserId(userId: string) {
    return await this.adminRepository.findOne({
      select: ['adminId', 'firstName', 'lastName', 'position', 'contactNumber'],
      where: { user: { userId: userId } },
    });
  }
}
