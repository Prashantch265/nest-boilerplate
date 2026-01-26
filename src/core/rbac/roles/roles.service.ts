import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { In, Repository } from 'typeorm';
import { PermissionService } from '../permissions/permissions.service';
import { AssignPermissionsDto } from './dtos/assign-permissions.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionService: PermissionService, // Inject Service instead of Repository
  ) {}

  /**
   * Creates a new role.
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  /**
   * Retrieves all roles.
   */
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  /**
   * Retrieves a single role by its ID, including its assigned permissions.
   */
  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'], // Ensure permissions are loaded with the role
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  /**
   * Finds multiple roles by their IDs and validates that all were found.
   */
  async findMultipleByIds(roleIds: string[]): Promise<Role[]> {
    const roles = await this.roleRepository.findBy({
      id: In(roleIds),
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException(
        'One or more specified roles were not found.',
      );
    }

    return roles;
  }

  /**
   * Updates a role's details, such as its name.
   */
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // We use findOne to ensure the role exists and to retrieve it.
    const role = await this.findOne(id);
    // Merge the new data from the DTO into the existing role entity.
    this.roleRepository.merge(role, updateRoleDto);
    // Save the updated entity back to the database.
    return this.roleRepository.save(role);
  }

  /**
   * Assigns a set of permissions to a role, overwriting any existing permissions.
   */
  async assignPermissions(
    roleId: string,
    assignPermissionsDto: AssignPermissionsDto,
  ): Promise<Role> {
    const role = await this.findOne(roleId);

    // Delegate the task of finding and validating permissions to the PermissionsService
    const permissions = await this.permissionService.findMultipleByIds(
      assignPermissionsDto.permissionIds,
    );

    // Assign the found permissions to the role and save.
    role.permissions = permissions;
    return this.roleRepository.save(role);
  }

  /**
   * Deletes a role.
   */
  async remove(id: string): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
}
