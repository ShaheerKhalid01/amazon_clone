import { SetMetadata } from '@nestjs/common';

/**
 * Roles decorator for role-based access control
 * Usage: @Roles('ADMIN', 'SELLER')
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
