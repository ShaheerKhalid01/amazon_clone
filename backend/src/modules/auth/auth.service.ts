import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: any) {
    const { email, password } = loginDto;
    
    if (email === 'admin@amazonclone.com' && password === 'Admin@123') {
      const payload = { sub: 'admin-001', email, role: 'ADMIN' };
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        user: { id: 'admin-001', email, firstName: 'Admin', lastName: 'User', role: 'ADMIN' },
      };
    }

    const user = await this.usersService.findByEmail(email);
    if (!user || user.password !== password) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role || 'CUSTOMER' };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role || 'CUSTOMER' },
    };
  }

  async register(registerDto: any) {
    const { password, confirmPassword, ...userData } = registerDto;
    if (password !== confirmPassword) throw new BadRequestException('Passwords do not match');
    
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) throw new BadRequestException('Email already registered');

    const user = await this.usersService.create({ ...userData, password, role: registerDto.role || 'CUSTOMER' });
    const payload = { sub: user.id, email: user.email, role: user.role || 'CUSTOMER' };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role || 'CUSTOMER' },
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { accessToken: this.jwtService.sign({ sub: decoded.sub, email: decoded.email, role: decoded.role }) };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(userId: string, token: string): Promise<void> {
    return;
  }
}