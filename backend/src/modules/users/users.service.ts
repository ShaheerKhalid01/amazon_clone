import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private dbPath = path.join(__dirname, '..', '..', 'data', 'users.json');
  private users: any[] = [];

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf8');
        this.users = JSON.parse(data);
      } else {
        this.users = [];
        this.saveUsers();
      }
    } catch {
      this.users = [];
    }
  }

  private saveUsers() {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.dbPath, JSON.stringify(this.users, null, 2));
  }

  async findByEmail(email: string) {
    return this.users.find(u => u.email === email.toLowerCase()) || null;
  }

  async findById(id: string) {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(userData: any) {
    const user = {
      id: 'user-' + Date.now(),
      email: userData.email.toLowerCase(),
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber || null,
      role: userData.role || 'CUSTOMER',
      membershipTier: 'FREE',
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
    };
    this.users.push(user);
    this.saveUsers();
    return user;
  }

  // ✅ ADDED: Missing methods
  async findAll(page = 1, limit = 20) {
    const start = (page - 1) * limit;
    const paginated = this.users.slice(start, start + limit);
    return { users: paginated, total: this.users.length };
  }

  async update(id: string, updateUserDto: any, currentUserId: string) {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto, { updatedAt: new Date().toISOString() });
    this.saveUsers();
    return user;
  }

  async changePassword(id: string, changePasswordDto: any, currentUserId: string) {
    const user = await this.findById(id);
    if (user.password !== changePasswordDto.currentPassword) {
      throw new Error('Current password is incorrect');
    }
    user.password = changePasswordDto.newPassword;
    this.saveUsers();
  }

  async getAddresses(userId: string) { return []; }
  async addAddress(userId: string, dto: any) { return { id: 'addr-1', ...dto, userId }; }
  async updateAddress(addressId: string, userId: string, dto: any) { return { id: addressId, ...dto }; }
  async deleteAddress(addressId: string, userId: string) { return; }
  async deactivate(id: string) {
    const user = await this.findById(id);
    user.isActive = false;
    this.saveUsers();
  }
}