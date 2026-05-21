import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

/**
 * Users Service
 * Handles all user-related business logic
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      ...rest,
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created: ${savedUser.email}`);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  /**
   * Find all users with pagination
   */
  async findAll(
    page = 1,
    limit = 20,
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'membershipTier',
        'isActive',
        'createdAt',
      ],
    });

    return { users, total };
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses', 'paymentMethods'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
      select: [
        'id',
        'email',
        'password',
        'firstName',
        'lastName',
        'role',
        'isActive',
        'membershipTier',
      ],
    });
  }

  /**
   * Update user profile
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<User> {
    // Ensure user can only update their own profile (unless admin)
    if (id !== currentUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.findById(id);

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    this.logger.log(`User updated: ${updatedUser.email}`);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  /**
   * Change user password
   */
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
    currentUserId: string,
  ): Promise<void> {
    if (id !== currentUserId) {
      throw new ForbiddenException('You can only change your own password');
    }

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash and update new password
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 12);
    await this.userRepository.save(user);

    this.logger.log(`Password changed for user: ${id}`);
  }

  /**
   * Delete user (soft delete)
   */
  async deactivate(id: string): Promise<void> {
    const user = await this.findById(id);
    user.isActive = false;
    await this.userRepository.save(user);
    this.logger.log(`User deactivated: ${user.email}`);
  }

  /**
   * Add user address
   */
  async addAddress(
    userId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    // If this is default, remove default from other addresses
    if (createAddressDto.isDefault) {
      await this.addressRepository.update(
        { userId, isDefault: true },
        { isDefault: false },
      );
    }

    const address = this.addressRepository.create({
      userId,
      ...createAddressDto,
    });

    return this.addressRepository.save(address);
  }

  /**
   * Get user addresses
   */
  async getAddresses(userId: string): Promise<Address[]> {
    return this.addressRepository.find({
      where: { userId, isActive: true },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Update address
   */
  async updateAddress(
    addressId: string,
    userId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Handle default address logic
    if (updateAddressDto.isDefault) {
      await this.addressRepository.update(
        { userId, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: string, userId: string): Promise<void> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    address.isActive = false;
    await this.addressRepository.save(address);

    // If deleted address was default, set another as default
    if (address.isDefault) {
      const nextAddress = await this.addressRepository.findOne({
        where: { userId, isActive: true },
        order: { createdAt: 'ASC' },
      });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await this.addressRepository.save(nextAddress);
      }
    }
  }
}
