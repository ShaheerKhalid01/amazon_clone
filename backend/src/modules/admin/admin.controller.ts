import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus, Logger, ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { UserRole } from '@shared/enums';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  // ===== DASHBOARD =====
  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard overview' })
  async getDashboard() {
    return this.adminService.getDashboardOverview();
  }

  // ===== USER MANAGEMENT =====
  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  async getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
  ) {
    return this.adminService.getAllUsers(page, limit, search, role);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle user active status' })
  async toggleUserStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  @Put('users/:id/role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user role' })
  async updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('role') role: UserRole,
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id);
  }

  // ===== PRODUCT MANAGEMENT =====
  @Get('products')
  @ApiOperation({ summary: 'Get all products (admin)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllProducts(page, limit, search, status);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete product (admin)' })
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Put('products/:id/toggle-featured')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle product featured status' })
  async toggleFeatured(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.toggleFeatured(id);
  }

  // ===== ORDER MANAGEMENT =====
  @Get('orders')
  @ApiOperation({ summary: 'Get all orders (admin)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllOrders(page, limit, status);
  }

  @Put('orders/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateOrderStatus(id, status);
  }

  // ===== ANALYTICS =====
  @Get('analytics/revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  async getRevenueAnalytics(@Query('period') period: string = 'monthly') {
    return this.adminService.getRevenueAnalytics(period);
  }

  @Get('analytics/top-products')
  @ApiOperation({ summary: 'Get top selling products' })
  @ApiQuery({ name: 'limit', required: false })
  async getTopProducts(@Query('limit') limit = 10) {
    return this.adminService.getTopProducts(limit);
  }

  @Get('analytics/user-stats')
  @ApiOperation({ summary: 'Get user statistics' })
  async getUserStats() {
    return this.adminService.getUserStats();
  }
}
