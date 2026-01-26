import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './permissions.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * Retrieves a list of all available permissions.
   * This is useful for an admin UI to display all possible permissions
   * that can be assigned to a role.
   */
  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  /**
   * Finds multiple permissions by their IDs and validates that all were found.
   */
  async findMultipleByIds(permissionIds: string[]): Promise<Permission[]> {
    const permissions = await this.permissionRepository.findBy({
      id: In(permissionIds),
    });

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions were not found');
    }

    return permissions;
  }
}
